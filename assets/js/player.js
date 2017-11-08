class Player{
  constructor(planet){
    this.planet = planet;												//planeta target
    this.pos = planet.pos.copy();										// posicao
    this.direction = p5.Vector.fromAngle(radians(180));
    this.vel = 1.5;														//aceleracao do mesmo
    this.width = 30;
    this.height = 40;
    this.animationStatus = 0;											// controlador da animacao
    this.walking = false;												//se true está andando
    this.changing = false;												//se true é foguete
    this.animation = [loadImage("assets/images/player.png"),
                      loadImage("assets/images/player-left.png"),
                      loadImage("assets/images/player-right.png")];
	  this.rocket = new Rocket(this.pos, this.direction);
    this.visible = true;
    this.pieces = 0;
  }

  /**
  * desenha o personagem na tela
  */
  render(){
    push();
  	//rotaciona a imagem para a mesma direcao do personagem
    translate(this.pos.x, this.pos.y);

  	//se nao estiver trocando de planeta entao usa sprites do personagem
  	//senao usa o foguete
  	if(this.visible){
      var angleToRotate = atan2(this.direction.x, this.direction.y);
      rotate(-angleToRotate + radians(180));
		  image(this.animation[ int(this.animationStatus / 10)], 0, 0, this.width, this.height);
  	}else{
      this.rocket.render();
    }
    pop();
  }

  /**
  * altera o controlador da animacao
  */
  animate(){
    this.animationStatus++;
    if(this.animationStatus / 10 >= this.animation.length){
      this.animationStatus = 1;
    }
  }

  update(){

  	//se está distante do planeta alvo aplica forca em direcao ao alvo
  	if(this.pos.dist(this.planet.pos) > this.planet.r - this.width/2){
      this.getInsideRocket();

      var path = this.pos.copy();
      path.sub(this.planet.pos);
      var angle = degrees(this.direction.angleBetween(path));
      this.direction.rotate(angle);
    }else{
      this.getOutsideRocket();
      this.changing = false;
    }
  	//se estiver andando aplica forca para 'frente'
  	if(this.walking){
      this.animate();
    }

  	//testa se e uma posicao valida
  	//se sim entao adiciona a forca a posicao
  	var temp = this.pos.copy();
    temp.sub(this.direction.copy().mult(this.vel));
    if(this.walking && temp.dist(this.planet.pos) < this.planet.r - this.width/2
        || this.changing){
      this.pos.sub(this.direction.copy().mult(this.vel));
    }
  }

  /**
  * anda
  */
  walk(){
    this.walking = true;
  }

  /**
  * para de andar
  */
  stop(){
    this.walking = false;
    this.animationStatus = 0;
  }
  getInsideRocket(){
    this.visible = false;
    this.rocket.visible = true;
  }

  getOutsideRocket(){
    this.visible = true;
    this.rocket.visible = false;
  }

  rotate(direction){
    this.direction.rotate(radians(direction));
  }

  /**
  *se o planeta atual nao tiver pecas entao vai para o planeta novo
  */
  changePlanet(planet){
    if(this.planet.pieces.length <=0){
      this.changing = true;
      planet.putPieces(5);
      this.planet = planet;
    }
  }

  catchPiece(){
    for (var i = 0; i < this.planet.pieces.length; i++) {
      var piece = this.planet.pieces[i];
      if(this.pos.dist(piece.pos) < piece.r){
        this.planet.pieces.pop(piece);
        this.pieces++;
      }
    }
  }
}
