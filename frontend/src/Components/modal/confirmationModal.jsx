import React from 'react'

function confirmationModal({ onConfirm, header, text }) {
    return (
        <>  
            <dialog id="confirm-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-semibold text-lg mb-4">{header}</h3>
                    <form method="dialog" className="space-y-4" onSubmit={onConfirm}>
                        <h3 className="font-semibold text-md mb-5">{text}</h3>
                        <div className="modal-action">
                        <button type="submit" className="btn btn-success">Yes</button>
                        
                        {/* Close Button */}
                        <button type="button" className="btn btn-error" onClick={() => document.getElementById('confirm-modal').close()}>
                            No
                        </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}

export default confirmationModal
