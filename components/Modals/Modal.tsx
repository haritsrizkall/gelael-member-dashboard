import { generateMaxWidth } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export interface ModalProps {
  isOpen: boolean;
  onClose: (data?: any) => void;
  children?: JSX.Element;
  closeButton?: boolean;
  options?: any;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const Modal = ({
  isOpen,
  onClose,
  children,
  closeButton,
  loading,
  size,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed z-50 inset-0 h-full bg-[rgba(0,0,0,.2)] text-black"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white border-t-[4px] border-indigo-700 px-5 pt-10 pb-10 w-11/12 max-w-xl mx-auto mt-[10vh] relative max-h-[80vh] ${
              !loading ? "overflow-y-auto" : "overflow-y-hidden"
            } scrollbar`}
          >
            {closeButton && (
              <button
                onClick={onClose}
                type="button"
                className="absolute top-4 right-4 text-2xl hover:opacity-60"
              >
                <IoMdClose />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
