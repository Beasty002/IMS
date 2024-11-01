import React from "react";
import ReactDOM from "react-dom";

function Preview({ isOpen, inClose, totalFetchData }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div class="report-table-container">
      <div onClick={inClose} className="overlay"></div>

      <table>
        <thead class="report-table-head">
          <tr>
            <th rowspan="2">S.N</th>
            <th rowspan="2">Size/MM</th>
            <th colspan="4">10MM</th>
            <th colspan="4">16MM</th>
          </tr>
          <tr>
            <th>OP</th>
            <th>IN</th>
            <th>OUT</th>
            <th>BAL</th>

            <th>OP</th>
            <th>IN</th>
            <th>OUT</th>
            <th>BAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>3x4</td>

            <td>56</td>
            <td>99</td>
            <td>89</td>
            <td>45</td>

            <td>47</td>
            <td>40</td>
            <td>0</td>
            <td>05</td>
          </tr>
          <tr>
            <td>2</td>
            <td>3x4</td>

            <td>56</td>
            <td>99</td>
            <td>89</td>
            <td>45</td>
            <td>47</td>
            <td>40</td>
            <td>0</td>
            <td>05</td>
          </tr>
          <tr>
            <td>3</td>
            <td>3x4</td>

            <td>56</td>
            <td>99</td>
            <td>89</td>
            <td>45</td>
            <td>47</td>
            <td>40</td>
            <td>0</td>
            <td>05</td>
          </tr>
        </tbody>
      </table>
    </div>,
    document.getElementById("preview-overlay")
  );
}

export default Preview;
