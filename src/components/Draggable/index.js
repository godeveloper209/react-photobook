import React from 'react';

const throttle = (f) => {
    let token = null, lastArgs = null;
    const invoke = () => {
        f(...lastArgs);
        token = null;
    };
    const result = (...args) => {
        lastArgs = args;
        if (!token) {
            token = requestAnimationFrame(invoke);
        }
    };
    result.cancel = () => token && cancelAnimationFrame(token);
    return result;
};

class Draggable extends React.PureComponent {
    _ref = React.createRef();

    currentX = 0;
    currentY = 0;
    initialX = 0;
    initialY = 0;
    xOffset = 0;
    yOffset = 0;
    xPos = 50;
    yPos = 50;
    maxTop = 100;
    minTop = 0;
    maxLeft = 100;
    minLeft = 0;

    _onMouseDown = (event) => {
        // this.xOffset = this.currentX;
        // this.yOffset = this.currentY;
        if (event.type === "touchstart") {
            this.initialX = event.touches[0].clientX - this.xOffset;
            this.initialY = event.touches[0].clientY - this.yOffset;
        } else {
            this.initialX = event.clientX - this.xOffset;
            this.initialY = event.clientY - this.yOffset;
        }
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('mouseup', this._onMouseUp);
        event.preventDefault();
    };

    _onMouseUp = (event) => {
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
        event.preventDefault();
    };

    _onMouseMove = (event) => {
        let currentX;
        let currentY;
        const {xPosSum, yPosSum, xMul, yMul, xMin, xMax, yMin, yMax, onMove} = this.props;
        if (event.type === "touchmove") {
            currentX = event.touches[0].clientX - this.initialX;
            currentY = event.touches[0].clientY - this.initialY;
        } else {
            currentX = event.clientX - this.initialX;
            currentY = event.clientY - this.initialY;
        }
        let xPos = Math.round((xPosSum + currentX) * xMul);
        let yPos = Math.round((yPosSum + currentY) * yMul);
        if (xPos < this.maxLeft && xPos > this.minLeft) {
            this.xPos = xPos;
        }
        if (yPos < this.maxTop && yPos > this.minTop) {
            this.yPos = yPos;
        }
        if (currentX > xMin && currentX < xMax) {
            this.currentX = currentX;
            this.xOffset = currentX;
        }
        if (currentY > yMin && currentY < yMax) {
            this.currentY = currentY;
            this.yOffset = currentY;
        }
        onMove(
            this.currentX,
            this.currentY,
            this.xPos,
            this.yPos
        );
        event.preventDefault();
    };

    _update = throttle(() => {
        const {x, y} = this.props;
        this._ref.current.style.transform = `translate(${x}px, ${y}px)`;
    });

    componentDidMount() {
        const {x, y} = this.props;
        this.currentX = x;
        this.currentY = y;
        this.xOffset = x;
        this.yOffset = y;
        this._ref.current.addEventListener('mousedown', this._onMouseDown);
        this._update();
    }

    componentDidUpdate() {
        this._update();
    }

    componentWillUnmount() {
        this._ref.current.removeEventListener('mousedown', this._onMouseDown);
        this._update.cancel();
    }

    render() {
        return (
            <div className="draggable" ref={this._ref}>
                {this.props.children}
            </div>
        );
    }
}

export default Draggable;