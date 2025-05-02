import React from "react";
import { Modal } from "./index";

type SkipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const SkipModal: React.FC<SkipModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="セリフスキップ"
      confirmText="スキップする"
      cancelText="キャンセル"
      onConfirm={onConfirm}
      showCancelButton={true}
    >
      <p className="text-sm">
        次の選択肢までセリフをスキップします。
        <br />
        選択肢がない場合は、シナリオの最後までスキップします。
        <br />
        <br />
        スキップを実行しますか？
      </p>
    </Modal>
  );
};

export default SkipModal;
