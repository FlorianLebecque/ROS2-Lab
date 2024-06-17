import { useEffect, ReactNode } from "react";

const OpenCloseDialog: React.FC<{ children: React.ReactNode; dialogId: string }> = ({
    children,
    dialogId,
}) => {
    const ToggleDialog = () => {
        const dialog = document.getElementById(dialogId) as HTMLDialogElement;

        // add outside click listener if not already added
        if (dialog.onclick === null) {
            dialog.onclick = (e) => {
                if (e.target == dialog) {
                    dialog.close();
                }
            };
        }

        dialog.showModal();
    }

    return (
        <button className='btn btn-outline-primary' onClick={ToggleDialog} >
            {children}
        </button>
    );
}

export default OpenCloseDialog;