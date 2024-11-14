//
//  arrow.js
//  <箭头对象>
//

/**
 *
 * @param {Object} x1起始点横坐标
 * @param {Object} y1起始点纵坐标
 * @param {Object} x2结束点横坐标
 * @param {Object} y2结束点纵坐标
 */
function Arrow(x1, y1, x2, y2) {
  this.x1 = x1
  this.y1 = y1
  this.x2 = x2
  this.y2 = y2
  this.tmpX1 = null
  this.tmpY1 = null
  this.tmpX2 = null
  this.tmpY2 = null
  this.color = 'black'
}

Arrow.prototype.setColor = function (color) {
  this.color = color
}
Arrow.prototype.setHead = function (head) {
  this.head = head
}
Arrow.prototype.setDash = function (isDash) {
  this.isDash = isDash
}
Arrow.prototype.setLineWidth = function (lineWidth) {
  this.lineWidth = lineWidth
}

Arrow.prototype.draw = function (cxt) {
  // arbitrary styling
  cxt.strokeStyle = this.color
  cxt.fillStyle = this.color
  //    cxt.lineWidth = 0.5;
  // draw the line
  cxt.beginPath()
  cxt.moveTo(this.x1, this.y1)
  //	cxt.setLineDash([4, 4]);
  //	cxt.setLineDash([5, 10]);
  if (this.isDash) {
    cxt.lineWidth = this.lineWidth || 2
    if (cxt.setLineDash) {
      cxt.setLineDash([5, 10])
      cxt.setLineDash([3, 5])
      //        	cxt.setLineDash([1, 5]);
    }
  }
  if (
    this.tmpX1 != null &&
    this.tmpY1 != null &&
    this.tmpX2 != null &&
    this.tmpY2 != null
  ) {
    cxt.lineTo(this.tmpX1, this.tmpY1)
    cxt.closePath()
    cxt.stroke()
    cxt.beginPath()
    cxt.moveTo(this.tmpX1, this.tmpY1)
    cxt.lineTo(this.tmpX2, this.tmpY2)
    cxt.closePath()
    cxt.stroke()
    cxt.beginPath()
    cxt.moveTo(this.tmpX2, this.tmpY2)
    cxt.lineTo(this.x2, this.y2)
    cxt.closePath()
    cxt.stroke()
    var endRadians = Math.atan((this.y2 - this.tmpY2) / (this.x2 - this.tmpX2))
    endRadians += ((this.x2 >= this.tmpX2 ? 90 : -90) * Math.PI) / 180
    if (this.head) {
      this.drawArrowhead(cxt, this.x2, this.y2, endRadians)
    }
  } else if (
    this.tmpX1 != null &&
    this.tmpY1 != null &&
    this.tmpX2 == null &&
    this.tmpY2 == null
  ) {
    cxt.lineTo(this.tmpX1, this.tmpY1)
    cxt.closePath()
    cxt.stroke()
    cxt.beginPath()
    cxt.moveTo(this.tmpX1, this.tmpY1)
    cxt.lineTo(this.x2, this.y2)
    cxt.closePath()
    cxt.stroke()
    var endRadians1 = Math.atan((this.y2 - this.tmpY1) / (this.x2 - this.tmpX1))
    endRadians1 += ((this.x2 >= this.tmpX1 ? 90 : -90) * Math.PI) / 180
    if (this.head) {
      this.drawArrowhead(cxt, this.x2, this.y2, endRadians1)
    }
  } else if (
    this.tmpX1 == null &&
    this.tmpY1 == null &&
    this.tmpX2 == null &&
    this.tmpY2 == null
  ) {
    //        cxt.moveTo(this.x2, this.y2)
    cxt.lineTo(this.x2, this.y2)
    cxt.closePath()
    cxt.stroke()
    var endRadians2 = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1))
    endRadians2 += ((this.x2 >= this.x1 ? 90 : -90) * Math.PI) / 180
    if (this.head) {
      this.drawArrowhead(cxt, this.x2, this.y2, endRadians2)
    }
  }
  if (cxt.setLineDash) {
    cxt.setLineDash([])
  }
}

/**
 * 画箭头
 */
Arrow.prototype.drawArrowhead = function (cxt, x, y, radians) {
  cxt.save()
  cxt.beginPath()
  cxt.translate(x, y)
  cxt.rotate(radians)
  cxt.moveTo(0, 0)
  if (this.isDash) {
    cxt.lineTo(3, 6)
    cxt.lineTo(-3, 6)
  } else {
    cxt.lineTo(5, 10)
    cxt.lineTo(-5, 10)
  }
  cxt.closePath()
  cxt.restore()
  cxt.fill()
}

export default Arrow
