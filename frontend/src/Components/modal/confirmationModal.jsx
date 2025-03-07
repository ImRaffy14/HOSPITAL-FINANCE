import React from 'react'

function confirmationModal({ onConfirm }) {
    return (
        <>  
            <button className='btn btn-success' onClick={() => document.getElementById('edit-user-modal').showModal()}>Yes</button>

            <dialog id="confirm-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-semibold text-lg mb-4">Delete User</h3>
                    <form method="dialog" className="space-y-4" onSubmit={onConfirm()}>
                        <h3 className="font-semibold text-md mb-5">Are you sure you want to delete this user?</h3>
                        <div className="modal-action">
                        <button type="submit" className="btn btn-success">Yes</button>
                        
                        {/* Close Button */}
                        <button type="button" className="btn btn-error" onClick={() => document.getElementById('delete-user-modal').close()}>
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
