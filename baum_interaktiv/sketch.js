let geodata;
let treeData;

let backgroundImg;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

function preload() {
  geodata = loadJSON("lucerne-trees.json");
  backgroundImg = loadImage("tree_background.png");
}

let quadtree = d3.quadtree(); // D3 Funktion: macht es grid über de ganz Canvas
let highlightobj = null; // Variable Global definieren, damit sie in der Draw funktion wiederverwendet werden kann.

function setup() {
  createCanvas(900, 650);

  treeData = geodata.features;

  quadtree
    .x(function (d) {
      return d.geometry.coordinates[0];
    })
    .y(function (d) {
      return d.geometry.coordinates[1];
    })
    .addAll(treeData); // ih das grid vo obe di ganzi treeData ihnelade

  noLoop();
}

function mouseMoved() {
  console.log("mouseMoved", mouseX, mouseY);
  let lon = map(mouseX, 0, width, bounds.left, bounds.right);
  let lat = map(mouseY, 0, height, bounds.top, bounds.bottom);

  highlightobj = quadtree.find(lon, lat);
  console.log(highlightobj);

  redraw();
}

function draw() {
  background("#0E8960");
  image(backgroundImg, 0, 0, width, height);
  // drawTrees();

  if (highlightobj) {
    let lon = highlightobj.geometry.coordinates[0];
    let lat = highlightobj.geometry.coordinates[1];
    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);

    let treeAge = highlightobj.properties.PFLANZJAHR;
    let kronenDurchmesser = highlightobj.properties.KR_DURCHMESSER;
    let stumpfUmfang = highlightobj.properties.ST_UMFANG;

    let zeilenAbstand = 12;
    let textAbstand = 10;
    noFill();

    stroke("purple");
    strokeWeight(3);
    ellipse(x, y, 5, 5);

    noStroke();
    fill("black");

    strokeWeight(1);
    text("Pflanzenjahr:" + "    " + treeAge, x + 2 * textAbstand, y);
    text(
      "Kronendurchmesser:" + "   " + kronenDurchmesser,
      x + 2 * textAbstand,
      y + zeilenAbstand
    );
    text(
      "Stumpfumfang:" + "   " + stumpfUmfang + "  " + "mm",
      x + 2 * textAbstand,
      y + 2 * zeilenAbstand
    );

    stroke("black");
    strokeWeight(2);
    noFill();
    rect(x + textAbstand, y - 20, 180, 55);

    line(mouseX, mouseY, x, y);
  }
}

function keyTyped() {
  saveCanvas("tree_background", "png");
}

function drawTrees() {
  for (let i = 0; i < treeData.length; i++) {
    let treeObject = treeData[i];
    let geometry = treeObject.geometry;
    let properties = treeObject.properties;
    // console.log(properties);
    let coordinates = geometry.coordinates;
    let lat = coordinates[1];
    let lon = coordinates[0];

    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);

    noStroke();
    fill(209, 128, 205, 50);
    //ellipse(x, y, 10, 10);
    //ellipse(x, y, 5, 5);
    ellipse(x, y, 3, 3);
  }
}
