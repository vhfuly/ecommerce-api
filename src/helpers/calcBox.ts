const MIN_WIDTH = 11;
const MAX_WIDTH= 105;

const MIN_ALTURA = 2;
const MAX_ALTURA = 105;

const MIN_COMPRIMENTO = 16;
const MAX_COMPRIMENTO = 105;

const MIN_SUM_CLA = 29;
const MAX_SUM_CLA = 200;

interface CartCorreios {
  weightKg: number;
  depthCm: number;
  heightCm: number;
  widthCm: number;
  amount: number;
  price: number;
  areaCm?: number;
}

const orderCart = (cart: CartCorreios[]) => {
	if(!Array.isArray(cart))  return cart;

	let _cart = cart.map(item => {
		let newHeight = Math.min( item.heightCm, item.depthCm, item.widthCm );
		let newDepth = Math.max( item.heightCm, item.depthCm, item.widthCm );
		let _temp = [item.heightCm, item.depthCm, item.widthCm ].sort((a,b) => a < b);
		item.widthCm = _temp[1];
		item.depthCm = newDepth;
		item.heightCm = newHeight;
		item.areaCm = item.widthCm * item.depthCm;
		return item;
 	});
	return _cart.sort((a,b) => a.areaCm < b.areaCm);
};

const calcBox = (cart: CartCorreios[]) => {
	if(!Array.isArray(cart)) return cart;

	let _cart = orderCart(cart);

	const box = {
		'height': 0, 		 /* altura final da caixa */
		'width': 0, 	 /* largura */
		'depth': 0,  /* ... */
		'qty_items': 0, 	 /* qtd de itens dentro da caixa */
		'message': null,   /* caso erro guarda mensagem */
		'size': 0, 		 /* capacidade total de armazenamento da caixa */
		'size_items': 0, /* volume armazenado */
		'size_empty': 0, /* volume livre */
		'remnant_depth': 0,
		'remnant_width': 0,
		'remnant_height': 0
	};

	if(_cart.length === 0 ) return "Erro: Carrinho encontra-se vazio.";

	_cart.forEach(item => {

		box.qty_items+=1;

		box.size_items += item.heightCm * item.widthCm * item.widthCm;

		if( box.remnant_depth >= item.widthCm && box.remnant_width >= item.widthCm ){

			if(item.heightCm > box.remnant_height){
				box.height += item.heightCm - box.remnant_height;
			}

			if(item.widthCm > box.depth){
				box.depth = item.widthCm;
			}

			box.remnant_depth = box.depth - item.widthCm;

			box.remnant_width = box.remnant_width - item.widthCm;

			box.remnant_height = item.heightCm > box.remnant_height ? item.heightCm : box.remnant_height;

			return;
		}

		// passo (N-1) - altura e' a variavel que sempre incrementa independente de condicao ...
		box.height += item.heightCm;

		// passo N - verificando se item tem dimensoes maiores que a caixa...
		if ( item.widthCm > box.width ) box.width = item.widthCm;

		if ( item.widthCm > box.depth ) box.depth = item.widthCm;

		// calculando volume remanescente...
		box.remnant_depth = box.depth;
		box.remnant_width = box.width - item.widthCm;
		box.remnant_height = item.heightCm;
	});

	// @opcional - calculando volume da caixa ...
	box.size = ( box.height * box.width * box.depth );

	// @opcional - calculando volume vazio! Ar dentro da caixa!
	box.size_empty = box.size - box.size_items;

	// checa se temos produtos e se conseguimos alcancar a dimensao minima ...
	if( _cart.length !== 0 ){
		// verificando se dimensoes minimas sao alcancadas ...
		if( box.height > 0 && box.height < MIN_ALTURA ) box.height = MIN_ALTURA ;
		if( box.width > 0 && box.width < MIN_WIDTH ) box.width = MIN_WIDTH ;
		if( box.depth > 0 && box.depth < MIN_COMPRIMENTO ) box.depth = MIN_COMPRIMENTO ;
	}

	// verifica se as dimensoes nao ultrapassam valor maximo
	if( box.height > MAX_ALTURA ) box.message = "Erro: Altura maior que o permitido.";
	if( box.width > MAX_WIDTH ) box.message = "Erro: Largura maior que o permitido.";
	if( box.depth > MAX_COMPRIMENTO ) box.message = "Erro: Comprimento maior que o permitido.";

	// @nota - nao sei se e' uma regra, mas por via das duvidas esta ai
	// Soma (C+L+A)	MIN 29 cm  e  MAX 200 cm
	if( (box.depth+box.depth+box.depth) < MIN_SUM_CLA ) box.message = "Erro: Soma dos valores C+L+A menor que o permitido.";

	if( (box.depth+box.depth+box.depth) > MAX_SUM_CLA ) box.message = "Erro: Soma dos valores C+L+A maior que o permitido.";

	return box;
}

// carrinho = [
// 	{ title: 'Livro - A Arte da Guerra', alturaCm: 5, larguraCm: 30, profundidadeCm: 20 },
// 	{ title: 'Livro - A Arte da Guerra', alturaCm: 5, larguraCm: 30, profundidadeCm: 20 },
// 	{ title: 'Livro - Use a Cabeça Estatistica', alturaCm: 5, larguraCm: 8, profundidadeCm: 22 },
// 	{ title: 'Livro - Use a Cabeça Web Design', alturaCm: 28, larguraCm: 15, profundidadeCm: 15 }
// ];

// const box = calcBox( carrinho );

// console.log(box);

export { calcBox };