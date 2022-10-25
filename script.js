var image;
var hide;
var start;

function imageLoaded(image) {
  if (image == null || !image.complete()) {
    alert("image not loaded");
    return false;
  } else {
    return true;
  }
}

function uploadShow() {
  var fileinputShown = document.getElementById("fileinput-shown");
  image = new SimpleImage(fileinputShown);
  var canva = document.getElementById("shown-canva");
  image.drawTo(canva);
}

function shownImageDimensions() {
  if (imageLoaded(image)) {
    var width = image.getWidth();
    var height = image.getHeight();
    var size = width + " x " + height;
    var d = document.getElementById("shown-dimensions");
    d.innerHTML = size;
  }
}

function uploadHide() {
  var fileinputHidden = document.getElementById("fileinput-hidden");
  hide = new SimpleImage(fileinputHidden);
  var canva = document.getElementById("hidden-canva");
  hide.drawTo(canva);
}

function hiddenImageDimensions() {
  if (imageLoaded(hide)) {
    var width = hide.getWidth();
    var height = hide.getHeight();
    var size = width + " x " + height;
    var d = document.getElementById("hidden-dimensions");
    d.innerHTML = size;
  }
}

//Combine
function crop(image,width,height){
  var cropped = new SimpleImage(width,height);
  for(var p of image.values()){
      var x = p.getX();
      var y = p.getY();
      if (x < width && y < height){
          var cp = cropped.getPixel(x,y);
          cp.setRed(p.getRed());
          cp.setGreen(p.getGreen());
          cp.setBlue(p.getBlue());
      }
  }
  return cropped;
}

function pixchange(pixval){
  var a = Math.floor(pixval/16) * 16;
  return a;
}
function chop2hide(image){
  for (var pi of image.values()){
      pi.setRed(pixchange(pi.getRed()));
      pi.setGreen(pixchange(pi.getGreen()));
      pi.setBlue(pixchange(pi.getBlue()));
  }
  return image;
}
function shift(image){
  var hidden = new SimpleImage(image.getWidth(),image.getHeight());
  for (var pix of image.values()){
      var x = pix.getX();
      var y = pix.getY();
      var hp = hidden.getPixel(x,y);
      hp.setRed(Math.floor(pix.getRed()/16));
      hp.setGreen(Math.floor(pix.getGreen()/16));
      hp.setBlue(Math.floor(pix.getBlue()/16));
  }
  return hidden;
}
function newpv(p,q){
  var npv = p + q;
  if (npv > 255) print ("Error: newpv too big");
  return npv;
}
function combine(appear,hidden){
  var combined = new SimpleImage(appear.getWidth(),appear.getHeight());
  for (var ap of appear.values()){
      var hp = hidden.getPixel(ap.getX(),ap.getY());
      var cp = combined.getPixel(ap.getX(),ap.getY());
      cp.setRed(newpv(ap.getRed(),hp.getRed()));
      cp.setGreen(newpv(ap.getGreen(),hp.getGreen()));
      cp.setBlue(newpv(ap.getBlue(),hp.getBlue()));
  }
  return combined;
}
function chopShownImage() {
  start = crop(image, hide.getWidth(), hide.getHeight());
  canva = document.getElementById("cropped-canva");
  start.drawTo(canva);
}

function croppedImageDimensions() {
  if (imageLoaded(start)) {
    var width = start.getWidth();
    var height = start.getHeight();
    var size = width + " x " + height;
    var d = document.getElementById("cropped-dimensions");
    d.innerHTML = size;
  }
}

function combineImage() {
  start = chop2hide(start);
  hide = shift(hide);
  combined = combine(start,hide);

  var canva = document.getElementById("combined-canva");
  combined.drawTo(canva);
}

//Extract
function convertRGB(pixelValue){
  var extractedRGB = (pixelValue - Math.floor(pixelValue/16) * 16) * 16;
  return extractedRGB;
}

function extract(image){
  var extracted = new SimpleImage(image.getWidth(),image.getHeight());
  for (var p of image.values()){
      var ep = extracted.getPixel(p.getX(),p.getY());
      ep.setRed(convertRGB(p.getRed()));
      ep.setGreen(convertRGB(p.getGreen()));
      ep.setBlue(convertRGB(p.getBlue()));
  }
  return extracted;
}

function extractImage() {
  var extracted = extract(combined);
  var canva = document.getElementById("extracted-canva");
  extracted.drawTo(canva);
}