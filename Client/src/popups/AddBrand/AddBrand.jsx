import React from 'react'
import './AddBrand.css'

export default function AddBrand() {
    return (
        <>
            <div className="overlay"></div>
            <section id='addBrand'>
                <h2>New Brand</h2>
                <form action="">
                    <div className="form-container">
                        <label HTMLfor="">Brand Title</label>
                        <input type="text" placeholder='eg: mayur, creata .....' name="" id="" />
                    </div>
                    <div className="form-container">
                        <label>Does this brands'product have multile variations ?</label>
                        <div className="radio-form-container">
                            <div className="radio-form">
                                <input type="radio" name="variation" id="variationYes" checked />
                                <label HTMLfor="variationYes">Yes</label>
                            </div>
                            <div className="radio-form">
                                <input type="radio" name="variation" id="variationNo" />
                                <label HTMLfor="variationNo">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-container">
                        <label HTMLfor="">Row Label</label>
                        <input type="text" placeholder='eg size , code ....' />
                    </div>
                    <div className="form-container">
                        <label HTMLfor="">Column Label</label>
                        <input type="text" placeholder='eg name , mm ....' />
                    </div>
                    <div className="btn-container">
                        <button className='cancel-btn'>Cancel</button>
                        <button type="submit" className='primary-btn'>Add</button>
                    </div>
                </form>
            </section>
        </>

    )
}
