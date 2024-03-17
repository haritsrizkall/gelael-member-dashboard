import Button from "../Button";
import Modal, { ModalProps } from "./Modal";
import { motion } from "framer-motion";

interface DeleteConfirmationModalProps extends ModalProps {
  onDelete: () => Promise<void>;
  loading?: boolean;
}

const DeleteConfirmationModal = (props: DeleteConfirmationModalProps) => {
  return (
    <Modal {...props}>
      <div className="text-center">
        <h1 className="text-center text-xl font-medium mb-10">Delete Confirmation</h1>
        <div className="mb-5">
          <h2>Are you sure want delete this record?</h2>
        </div>
        <div className="flex">
            <Button
                onClick={props.onDelete}
                text="Delete"
                isLoading={props.loading}
                className="mr-5 bg-danger border-danger hover:bg-danger-dark hover:border-danger-dark"
                loadingClassName="bg-red-300 text-danger"
            />
            <Button
                onClick={props.onClose}
                text="Cancel"
                isLoading={false}
                className="bg-gray border-gray text-graydark hover:bg-gray hover:border-gray"
            />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;