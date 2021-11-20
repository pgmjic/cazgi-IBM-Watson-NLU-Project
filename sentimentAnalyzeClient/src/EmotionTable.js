import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      //Returns the emotions as an HTML table
      return (  
        <div class="table-responsive">
          <table className="table table-bordered">
            <tbody className="border border-dark border-5">
                {
                  /*Write code to use the .map method that you worked on in the 
                    Hands-on React lab to extract the emotions. If you are stuck,
                    please click the instructions to see how to implement a map*/
                  Object.entries(this.props.emotions).map(function (mapentry) {
                    return (
                      <tr>
                        <td style={{color: "red",border: "1px solid black"}}>{mapentry[0]}</td>
                        <td style={{color: "red",border: "1px solid black"}}>{mapentry[1]}</td>
                      </tr>
                    )
                  })
                }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;