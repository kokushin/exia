import React, { useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "OK",
  cancelText = "キャンセル",
  showCancelButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // アニメーション開始のために少し遅延させる
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      // アニメーション完了後に非表示にする
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300); // トランジション時間と合わせる
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* オーバーレイ背景 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" onClick={onClose} />

      {/* モーダルコンテンツ */}
      <div
        className={`relative bg-gray-800 text-white rounded-md shadow-lg max-w-md w-full mx-4 transition-all duration-300 ${
          isAnimating ? "transform scale-100 translate-y-0" : "transform scale-95 translate-y-4"
        }`}
      >
        {title && (
          <div className="border-b border-gray-700 px-6 py-3">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}

        <div className="px-6 py-4">{children}</div>

        <div className="border-t border-gray-700 px-6 py-3 flex justify-end space-x-2">
          {showCancelButton && (
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onClick={onClose}>
              {cancelText}
            </button>
          )}

          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
