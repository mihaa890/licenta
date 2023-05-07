import { ModalContainer, ModalHeader, ModalOverlay, ModalTitle, ModalActions, ModalBody, ModalButton, CloseButton } from "./Modal.style";

const Modal = ({ title, onClose, actions, children }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>X</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalActions>
          {actions.map((action) => (
            <ModalButton
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </ModalButton>
          ))}
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
