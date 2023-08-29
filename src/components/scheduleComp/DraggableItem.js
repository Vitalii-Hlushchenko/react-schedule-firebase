import React, {Component} from 'react';
import {DayPilot} from "daypilot-pro-react";

class DraggableItem extends Component {

  render() {
    return (<div className={"draggable-item"} ref={element => {
      if (!element) {
        return;
      }
      DayPilot.Scheduler.makeDraggable({
        element: element,
        id: this.props.id,
        text: this.props.text,
        duration: this.props.days*24*60*60,
        onDragStart: args => {
          args.options.element.classList.add("draggable-source");
        },
        onDrop: args => {
          args.options.element.classList.remove("draggable-source");
          
        }
      })
    }}>{this.props.text}</div>);
  }
}

export default DraggableItem;