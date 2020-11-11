import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Input, InputGroup, Grid, Row, Col, Container, Navbar, Checkbox, CheckboxGroup, Header, Icon, Button, Footer, Content,
Panel} from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserFriends, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import api from "../api/api";

class Lista extends Component {

	constructor(){
		super();
		this.state = {
			restaurantes: [],
			restaurantesHelper: [],
			cidades:[],
			nota: 0,
			cozinha: 0,
			preco: 0,
			idCidade: '',
			nameCidade: ''
		};
	}

	componentDidMount(){
		this.firstCall()
		this.setState({
			nameCidade: localStorage.getItem('nameCidade')
		})
		localStorage.setItem('coz', 0);
		localStorage.setItem('cus', 0);
		localStorage.setItem('rat', 0);
	}

	firstCall(){
		var entity = localStorage.getItem('idCidade')
		var url = '/search?entity_id='+entity+'&entity_type=city';
		api.get(url)
			.then(resposta => {
				var res = resposta.data;
				var estabelecimentos = res.restaurants;
				this.setState({
					restaurantes: estabelecimentos
				})				
			})
			.catch(err => {
				console.log(err)
			})
	}

	cuisineCall(cuisine){
		var entity = localStorage.getItem('idCidade');
		var cozinha = localStorage.getItem('coz');
		if(cuisine == 0){
			var cuisines = cozinha;
			var url = '/search?entity_id='+entity+"&entity_type=city&cuisines="+cuisines;
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					this.setState({
						restaurantes: estabelecimentos
					})				
				})
				.catch(err => {
					console.log(err)
				})
		}else{
			if(cozinha == cuisine){
				localStorage.setItem('coz', 0)
				this.setState({cozinha: 0});
				this.filtro();	
			}else{
				this.setState({cozinha: cuisine})
				localStorage.setItem('coz', cuisine);
				var cuisines = cuisine;
				var url = '/search?entity_id='+entity+"&entity_type=city&cuisines="+cuisines;
				api.get(url)
					.then(resposta => {
						var res = resposta.data;
						var estabelecimentos = res.restaurants;
						this.setState({
							restaurantes: estabelecimentos
						})
						this.filtro();		
					})
					.catch(err => {
						console.log(err)
					})
			}
		}
	}

	ratingCall(a, b){
		var coz = localStorage.getItem('coz');
		var ava = localStorage.getItem('rat');
		var cus = localStorage.getItem('cus');
		var city = localStorage.getItem('idCidade');
		
		if(coz == 0){
			var url = '/search?entity_id='+city+'&entity_type=city';
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					var holder = [];
					var x;
					for(x = 0; x < estabelecimentos.length; x++){
						var nota = parseInt(estabelecimentos[x].restaurant.user_rating.aggregate_rating);
						if(nota == ava){
							holder.push(estabelecimentos[x])
						}
					}
					console.log(holder);
					this.setState({restaurantes: holder})				
				})
				.catch(err => {
					console.log(err)
				})
		}else if(coz != 0 && cus == 0){
			console.log("elele")
			var url = '/search?entity_id='+city+"&entity_type=city&cuisines="+coz;
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					var holder = [];
					var x;
					for(x = 0; x < estabelecimentos.length; x++){
						var nota = parseInt(estabelecimentos[x].restaurant.user_rating.aggregate_rating);
						if(nota == ava){
							holder.push(estabelecimentos[x])
						}
					}
					this.setState({restaurantes: holder})				
				})
				.catch(err => {
					console.log(err)
				})
		}else if(coz != 0 && cus != 0){
			var url = '/search?entity_id='+city+"&entity_type=city&cuisines="+coz;
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					var holder = [];
					var x;
					for(x = 0; x < estabelecimentos.length; x++){
						var nota = parseInt(estabelecimentos[x].restaurant.user_rating.aggregate_rating);
						var preco = parseInt(estabelecimentos[x].restaurant.average_cost_for_two);
						if(a == 0){
							if(nota == ava && preco < a){
								holder.push(estabelecimentos[x])
							}
						}else if(b == 0){
							if(nota == ava && preco > b){
								holder.push(estabelecimentos[x])
							}
						}else{
							if(nota == ava && preco > a && preco < b){
								holder.push(estabelecimentos[x])
							}
						}
					}
					this.setState({restaurantes: holder})				
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	costCall(a, b){
		console.log('here')
		var coz = localStorage.getItem('coz');
		var city = localStorage.getItem('idCidade');
		console.log(coz);

		if(coz == 0){
			var url = '/search?entity_id='+city+'&entity_type=city';
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					var holder = [];
					console.log(a);
					var x;
					for(x = 0; x < estabelecimentos.length; x++){
						var preco = parseInt(estabelecimentos[x].restaurant.average_cost_for_two);
						if(a == 0){
							if(preco <= b){
								holder.push(estabelecimentos[x])
							}
						}else if(b == 0){
							if(preco > a){
								holder.push(estabelecimentos[x])
							}
						}else{
							if(preco > a && preco < b){
								holder.push(estabelecimentos[x])
							}
						}
					}
					console.log(holder);
					this.setState({restaurantes: holder})				
				})
				.catch(err => {
					console.log(err)
				})
		}else if(coz != 0){
			console.log('h23')
			var url = '/search?entity_id='+city+"&entity_type=city&cuisines="+coz;
			api.get(url)
				.then(resposta => {
					var res = resposta.data;
					var estabelecimentos = res.restaurants;
					var holder = [];
					var x;
					for(x = 0; x < estabelecimentos.length; x++){
						var preco = parseInt(estabelecimentos[x].restaurant.average_cost_for_two);
						if(a == 0){
							if(preco <= b){
								holder.push(estabelecimentos[x])
							}
						}else if(b == 0){
							if(preco > a){
								holder.push(estabelecimentos[x])
							}
						}else{
							if(preco > a && preco < b){
								holder.push(estabelecimentos[x])
							}
						}
					}
					this.setState({restaurantes: holder})				
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	filtro(){
		const cus = localStorage.getItem('cus');
		const coz = localStorage.getItem('coz');
		const ava = localStorage.getItem('rat');

		console.log(cus);

		if(ava == 0 && coz == 0 && cus == 0){
			this.firstCall()
		}else if(ava == 0 && coz != 0 && cus == 0){
			this.cuisineCall(0);
		} else if(ava != 0 && cus == 0){
			this.ratingCall()
		} else if(ava != 0 && cus != 0){
			console.log('kuku')
			if(cus == 1){
				console.log('vysi')
				this.ratingCall(0, 50)
			}else if(cus == 2){
				console.log('vysiw')
				this.ratingCall(50, 80)
			}else if(cus == 3){
				console.log('vysi5')
				this.ratingCall(80, 110)
			}else if(cus == 4){
				console.log('vys7')
				this.ratingCall(110, 0)
			}
		}else if(ava == 0 && cus != 0){
			console.log('hi');
			if(cus == 1){
				this.costCall(0, 50);
			}else if(cus == 2){
				this.costCall(50, 80);
			}else if(cus == 3){
				this.costCall(80, 110);
			}else if(cus == 4){
				this.costCall(110, 0);
			}
		}else if(ava != 0 && cus != 0 && coz != 0){
			console.log('hi');
			if(cus == 1){
				this.costCall(0, 50);
			}else if(cus == 2){
				this.costCall(50, 80);
			}else if(cus == 3){
				this.costCall(80, 110);
			}else if(cus == 4){
				this.costCall(110, 0);
			}
		}
	}

	custo(preco){
		var cus = localStorage.getItem('cus');
		if(cus == preco){
			localStorage.setItem("cus", 0);
			this.setState({custo: 0})
			this.filtro();	
		}else{
			localStorage.setItem("cus", preco);
			this.setState({custo: preco})
			this.filtro();
		}
	}

	definirNota(info){
		var rat = localStorage.getItem('rat');
		if(rat == info){
			localStorage.setItem('rat', 0);
			this.setState({nota: 0})
			this.filtro();
		}else{
			localStorage.setItem('rat', info);
			this.setState({nota: info})
			this.filtro()
		}
	}

	retornaCidade(event){
		this.setState({nameCidade: event})
		var cidade = event;
		api.get('/cities?q='+cidade)
			.then(resposta => {
				var res = resposta.data;
				var locais = res.location_suggestions;
				this.setState({cidades: locais})
			})
			.catch(err => {
				console.log(err)
			})
	}

	setCidade(cidade){
		this.setState({idCidade: cidade.id,cidades: [],nameCidade: cidade.name})
		localStorage.setItem("idCidade", cidade.id);
		localStorage.setItem("nameCidade", cidade.name);
		document.getElementById("inputCity").value = '';
		this.firstCall();
	}

	render(){
		return(
			<div>
				<Container className='restaurantContainer'>
					<Header>
				       	<Navbar appearance="inverse" style={{background: '#fff', padding: '1rem', boxShadow: 'rgba(0, 0, 0, 0.3) 0 1px 3px'}} >
							<Row>
								<Col lg={4}>
									<div className='logoL'>
										<img src='/static/media/logo-red.jpg'/>
									</div>
								</Col>
								<Col lg={20}>
									<Grid fluid>
										<Row gutter={6} className='menuBusca'>
											<Col sm={24} lg={19}>
												<InputGroup inside>
													<InputGroup.Addon>
														<Icon icon="map-marker" />
													</InputGroup.Addon>
													<Input 
														style={{borderRadius: 0, width: '100%'}}
														className='pesquisaInput'
														placeholder='Digite a sua cidade'
														id='inputCity'
														onChange = {(value) => this.retornaCidade(value)}
													/>
												</InputGroup>
												<div class='cidadesLista'>
													{this.state.cidades.map((cidade, index) => (
														<div className='cidadeDisplayMenu' onClick={() => this.setCidade(cidade)}>
															<p> {cidade.name}</p>
															<p> {cidade.state_name} </p>
														</div>
													))}
												</div>
											</Col>
											<Col sm={24} lg={5} >
												<Button style={{borderRadius: 0, width: '100%', fontSize: '15pt'}} color='green'>BUSCAR</Button>
											</Col>
										</Row>
									</Grid>
								</Col>
							</Row>
				        </Navbar>
				    </Header>
    	  			<Content>
        				<Grid fluid>
        					<Row>
        						<Col sm={24} lg={4} className='menuSide'>
        							<Panel shaded>
        								<p class='dividerType'> Nota: </p>
										<Checkbox
											checked={this.state.nota == 1 ? true : false}
											onChange={() => this.definirNota(1)}
										>
											<FontAwesomeIcon icon={farStar} />
										</Checkbox>
										<Checkbox
											checked={this.state.nota == 2 ? true : false}
											onChange={() => this.definirNota(2)}
										>
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
										</Checkbox>
								        <Checkbox
											checked={this.state.nota == 3 ? true : false}
											onChange={() => this.definirNota(3)}
										>
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
										</Checkbox>
								        <Checkbox
											checked={this.state.nota == 4 ? true : false}
											onChange={() => this.definirNota(4)}
										>
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
										</Checkbox>
								        <Checkbox
											checked={this.state.nota == 5 ? true : false}
											onChange={() => this.definirNota(5)}
										>
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
											<FontAwesomeIcon icon={farStar} />
										</Checkbox>
								        <p class='dividerType'> Custo para 2 pessoas: </p>
											<Checkbox
												checked={this.state.custo == 1 ? true : false}
												onChange={() => this.custo(1)}>Até R$50</Checkbox>
											<Checkbox 
												checked={this.state.custo == 2 ? true : false}
												onChange={() => this.custo(2)}>De R$50 até R$80</Checkbox>
											<Checkbox 
												checked={this.state.custo == 3 ? true : false}
												onChange={() => this.custo(3)}>De R$80 até R$110</Checkbox>
											<Checkbox 
												checked={this.state.custo == 4 ? true : false}
												onChange={() => this.custo(4)}>Acima de R$110</Checkbox>
								        <p class='dividerType'> Tipo de cozinha </p>
											<Checkbox
												checked={this.state.cozinha == 4 ? true : false}
												value = {4}
												onChange={(value) => this.setState({cozinha: value})}
												onClick={() => this.cuisineCall(4)}>Árabe</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 159 ? true : false}
												onChange={() => this.cuisineCall(159)}>Brasileira</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 25 ? true : false}
												onChange={() => this.cuisineCall(25)}>Chinesa</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 45 ? true : false}
												onChange={() => this.cuisineCall(45)}>Francesa</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 83 ? true : false}
												onChange={() => this.cuisineCall(83)}>Frutos do mar</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 55 ? true : false}
												onChange={() => this.cuisineCall(55)}>Italiana</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 60 ? true : false}
												onChange={() => this.cuisineCall(60)}>Japonesa</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 73 ? true : false}
												onChange={() => this.cuisineCall(73)}>Mexicana</Checkbox>
											<Checkbox 
												checked={this.state.cozinha == 162 ? true : false}
												onChange={() => this.cuisineCall(162)}>Peruana</Checkbox>
								  	</Panel>
        						</Col>
        						<Col sm={24} lg={20} className='optionSide'>
									<Col lg={24}>
										<p className='restauranteTitle'> Restaurantes em {this.state.nameCidade} </p> 
									</Col>
									<Col lg={24}>
										<div className='holderCard'>
										{this.state.restaurantes.map((restaurante, index) => (
											<div className='cardRest' key={index}>
												<Row className='cardHolder'>
													<Col lg={24} className='cardHead'>
														<img src={restaurante.restaurant.thumb}/>
													</Col>
													<Col lg={24} className='cardBody'>
														<p className='cardTitle'>{restaurante.restaurant.name}</p>
														<p className='cardSubTitle'> {restaurante.restaurant.location.address} </p>
														<p className='cardRating' style={{display: parseInt(restaurante.restaurant.user_rating.aggregate_rating) == 1 ? 'block' : 'none'}}>
															<FontAwesomeIcon icon={faStar}/>
														</p>
														<p className='cardRating' style={{display: parseInt(restaurante.restaurant.user_rating.aggregate_rating) == 2 ? 'block' : 'none'}}>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
														</p>
														<p className='cardRating' style={{display: parseInt(restaurante.restaurant.user_rating.aggregate_rating) == 3 ? 'block' : 'none'}}>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
														</p>
														<p className='cardRating' style={{display: parseInt(restaurante.restaurant.user_rating.aggregate_rating) == 4 ? 'block' : 'none'}}>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
														</p>
														<p className='cardRating' style={{display: parseInt(restaurante.restaurant.user_rating.aggregate_rating) == 5 ? 'block' : 'none'}}>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
															<FontAwesomeIcon icon={faStar}/>
														</p>
														<Row>
															<Col lg={7}>
																<div className='tagVerde'><FontAwesomeIcon icon={faUserFriends}/> R${restaurante.restaurant.average_cost_for_two} </div>
															</Col>
															<Col lg={13}>
																<div className='tagCinza'>{restaurante.restaurant.cuisines} </div>
															</Col>
														</Row>
													</Col>
												</Row>
											</div>
										))}
									</div>
									</Col>
									
        						</Col>
        					</Row>
        				</Grid>
      				</Content>
      				<Footer>Footer</Footer>
				</Container>
			</div>		
		)
	}
}

export default withRouter(Lista);