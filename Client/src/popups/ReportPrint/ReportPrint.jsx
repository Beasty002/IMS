import React from 'react'
import './ReportPrint.css'

export default function ReportPrint() {
    return (
        <section class="print-popup">
            <h1>Print Categories</h1>
            <section class="cat-list-to-print">
                <div class="cat-print-container">
                    <input type="checkbox" name="" id="selAll" /> <label htmlFor="selAll">Select All</label>
                </div>
                <div class="cat-print-container">
                    <input type="checkbox" name="" id="" /> <label htmlFor="">Plywood</label>
                </div>
                <div class="cat-print-container">
                    <input type="checkbox" name="" id="" /> <label htmlFor="">Doors</label>
                </div>
                <div class="cat-print-container">
                    <input type="checkbox" name="" id="" /> <label htmlFor="">laminates</label>
                </div>
            </section>
            <div class="btn-container">
                <button class="cancel-btn">Cancel</button>
                <button class="primary-btn">Print</button>
            </div>
        </section>

    )
}
