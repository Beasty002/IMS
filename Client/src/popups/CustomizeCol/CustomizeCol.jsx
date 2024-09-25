import React from 'react'
import './CustomizeCol.css'

export default function CustomizeCol() {
    return (
        <section className="customize-col-popup">
            <h2>Customize Columns</h2>
            <form action="">
                <div className="edit-box-container">
                    <div className="edit-col-box">
                        <input type="text" value={"mayur ply"} />
                        <div className="action-edit-col">
                            <i className="fa-regular fa-eye"></i>
                            <i className='bx bxs-edit-alt edit-icon'></i>
                            <i className='bx bx-trash del-icon'></i>
                        </div>

                    </div>
                    <div className="edit-col-box">
                        <input type="text" value={"mayur ply"} />
                        <div className="action-edit-col">
                            <i className="fa-regular fa-eye"></i>
                            <i className='bx bxs-edit-alt edit-icon'></i>
                            <i className='bx bx-trash del-icon'></i>
                        </div>

                    </div>
                </div>

                <div className="btn-container new-col-btn">
                    <button className="secondary-btn"> + New Column</button>
                </div>
                <div className="btn-container main-col-btn">
                    <button className="cancel-btn">
                        Cancel
                    </button>
                    <button className="primary-btn">Save</button>
                </div>
            </form>

        </section>
    )
}
