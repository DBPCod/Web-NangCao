<?php
include_once '../core/DB.php';

class VaiTroModel {
    private $db;

    public function __construct() {
        $this->db = (new DB())->conn;
    }

    // Lấy tất cả vai trò
    public function getAllVaiTro() {
        $result = $this->db->query("SELECT * FROM vaitro Where TrangThai = 1");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy vai trò theo IdVaiTro
    public function getVaiTroById($idVaiTro) {
        $stmt = $this->db->prepare("SELECT * FROM vaitro WHERE IdVaiTro = ? AND TrangThai = 1");
        $stmt->bind_param("i", $idVaiTro);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Lấy danh sách quyền của vai trò
    public function getPermissionsByRole($idVaiTro) {
        $stmt = $this->db->prepare("
            SELECT q.IdQuyen, q.TenQuyen, ct.xem, ct.them, ct.sua, ct.xoa
            FROM quyen q
            LEFT JOIN ctquyen ct ON q.IdQuyen = ct.IdQuyen AND ct.IdVaiTro = ?
        ");
        $stmt->bind_param("i", $idVaiTro);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy tất cả quyền
    public function getAllQuyen() {
        $result = $this->db->query("SELECT IdQuyen, TenQuyen FROM quyen");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Thêm vai trò mới
    public function addVaiTro($data) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra tên vai trò trùng lặp
            $stmt = $this->db->prepare("SELECT IdVaiTro FROM vaitro WHERE TenVaiTro = ? AND TrangThai = 1");
            $stmt->bind_param("s", $data['TenVaiTro']);
            $stmt->execute();
            if ($stmt->get_result()->fetch_assoc()) {
                throw new Exception("Tên vai trò đã tồn tại");
            }

            // Thêm vai trò
            $stmt = $this->db->prepare("INSERT INTO vaitro (TenVaiTro, TrangThai) VALUES (?, ?)");
            $stmt->bind_param("si", $data['TenVaiTro'], $data['TrangThai']);
            $stmt->execute();
            $roleId = $this->db->insert_id;

            // Thêm quyền vào ctquyen
            if (isset($data['permissions']) && is_array($data['permissions'])) {
                // Kiểm tra có ít nhất một quyền được chọn
                $validPermissions = array_filter($data['permissions'], function($perm) {
                    return $perm['xem'] || $perm['them'] || $perm['sua'] || $perm['xoa'];
                });

                if (empty($validPermissions)) {
                    throw new Exception("Vui lòng chọn ít nhất một quyền");
                }

                foreach ($data['permissions'] as $perm) {
                    $stmt = $this->db->prepare("SELECT IdQuyen FROM quyen WHERE TenQuyen = ?");
                    $stmt->bind_param("s", $perm['tenQuyen']);
                    $stmt->execute();
                    $result = $stmt->get_result()->fetch_assoc();

                    if ($result) {
                        $permId = $result['IdQuyen'];
                        $stmt = $this->db->prepare("
                            INSERT INTO ctquyen (IdQuyen, IdVaiTro, xem, them, sua, xoa)
                            VALUES (?, ?, ?, ?, ?, ?)
                        ");
                        $stmt->bind_param(
                            "iiiiii",
                            $permId,
                            $roleId,
                            $perm['xem'],
                            $perm['them'],
                            $perm['sua'],
                            $perm['xoa']
                        );
                        $stmt->execute();
                    }
                }
            }

            $this->db->commit();
            return $this->getVaiTroById($roleId);
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e->getMessage());
        }
    }

    // Cập nhật vai trò và quyền
    public function updateVaiTro($idVaiTro, $data) {
        $this->db->begin_transaction();
        try {
            // Kiểm tra tên vai trò trùng lặp (ngoại trừ vai trò hiện tại)
            $stmt = $this->db->prepare("SELECT IdVaiTro FROM vaitro WHERE TenVaiTro = ? AND IdVaiTro != ? AND TrangThai = 1");
            $stmt->bind_param("si", $data['TenVaiTro'], $idVaiTro);
            $stmt->execute();
            if ($stmt->get_result()->fetch_assoc()) {
                throw new Exception("Tên vai trò đã tồn tại");
            }

            // Cập nhật vai trò
            $stmt = $this->db->prepare("UPDATE vaitro SET TenVaiTro = ?, TrangThai = ? WHERE IdVaiTro = ?");
            $stmt->bind_param("sii", $data['TenVaiTro'], $data['TrangThai'], $idVaiTro);
            $stmt->execute();

            // Xóa quyền cũ
            $stmt = $this->db->prepare("DELETE FROM ctquyen WHERE IdVaiTro = ?");
            $stmt->bind_param("i", $idVaiTro);
            $stmt->execute();

            // Thêm quyền mới
            if (isset($data['permissions']) && is_array($data['permissions'])) {
                foreach ($data['permissions'] as $perm) {
                    $stmt = $this->db->prepare("SELECT IdQuyen FROM quyen WHERE TenQuyen = ?");
                    $stmt->bind_param("s", $perm['tenQuyen']);
                    $stmt->execute();
                    $result = $stmt->get_result()->fetch_assoc();

                    if ($result) {
                        $permId = $result['IdQuyen'];
                        $stmt = $this->db->prepare("
                            INSERT INTO ctquyen (IdQuyen, IdVaiTro, xem, them, sua, xoa)
                            VALUES (?, ?, ?, ?, ?, ?)
                        ");
                        $stmt->bind_param(
                            "iiiiii",
                            $permId,
                            $idVaiTro,
                            $perm['xem'],
                            $perm['them'],
                            $perm['sua'],
                            $perm['xoa']
                        );
                        $stmt->execute();
                    }
                }
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e->getMessage());
        }
    }

    // Xóa vai trò (Chuyển trạng thái)
    public function deleteVaiTro($idVaiTro) {
        $stmt = $this->db->prepare("UPDATE vaitro SET TrangThai = 0 WHERE IdVaiTro = ?");
        $stmt->bind_param("i", $idVaiTro);
        return $stmt->execute();
    }
}
?>
