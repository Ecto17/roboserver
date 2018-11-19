import { Menu } from '/js/client/Menu.mjs';

class Tile {

  /**
   * Used to differentiate the appearance and function of menu tiles.
   * @param {String} imageString 
   * @param {number} index 
   * @param {Function} onClick 
   * @param {Menu} menu 
   */
  constructor(imageString, index, onClick, menu) {
    let faceMaterial = menu.mapRender.tileFaceMaterial.clone();

    let image = new Image();
    image.src = `/assets/icons/ios-${imageString}.svg`;
    image.onload = ()=>{
      
      let drawingCanvas = document.createElement('canvas');
      const canvasSize = 128;
      drawingCanvas.width = canvasSize;
      drawingCanvas.height = canvasSize;
      let ctx = drawingCanvas.getContext('2d');
      
      ctx.fillStyle = "#003366";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      let imageSize = canvasSize * 3 / 4
      ctx.drawImage(img, (canvasSize / 2) - (imageSize / 2), 0, imageSize, imageSize);
      
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      let text = index;
      let textMeasure = ctx.measureText(text);
      ctx.fillText(text, (canvasSize / 2) - textMeasure.width / 2, canvasSize * 4 / 5);

      faceMaterial.map = new THREE.CanvasTexture(drawingCanvas);

    }

    this.onClick = onClick;
    this.menu = menu;
    this.mixers = menu.mapRender.mixers;
  
    let materialList = [
      menu.groupMaterial,
      menu.groupMaterial,
      menu.groupMaterial,
      menu.groupMaterial,
      faceMaterial,
      menu.groupMaterial,
    ];
    this.mesh = new THREE.Mesh(this.menu.mapRender.tileGeo, materialList);
  }

  /**
   * Used to make the clicked tile move back and forth.
   */
  animateClick() {

    let positionKeyFrame = new THREE.VectorKeyframeTrack('.position', [0, .25, .5], [
      this.position.x, this.position.y, this.position.z,
      this.position.x, this.position.y, -10,
      this.position.x, this.position.y, this.position.z,
    ]);

    let clickClip = new THREE.AnimationClip('Clicked', .5, [positionKeyFrame]);
    let clickMixer = new THREE.AnimationMixer(this);
    this.mixers.tileClick = clickMixer;
    let clickClipAction = clickMixer.clipAction( clickClip );
    clickClipAction.setLoop( THREE.LoopOnce );
    clickClipAction.clampWhenFinished = true;
    clickClipAction.play();

    clickMixer.addEventListener('finished', (event)=>{
      delete this.mixers.tileClick;
    });

    this.menu.fadeOut();

  }

}