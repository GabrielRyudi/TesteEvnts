import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import {Input, InputGroup, Grid, Row, Col, Button, Icon } from 'rsuite';
import api from "../api/api";

//Fazer o sugestões ao clicar seta o obj pra armazenar id e tudo mais

class Landing extends Component {

	constructor(){
		super();
		this.state = {
			nameCidade: '',
			idCidade: '',
			cidades: []
		};
		this.retornaCidade = this.retornaCidade.bind(this)
	}

	componentDidMount(){
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
		this.setState({
			idCidade: cidade.id,
			cidades: [],
			nameCidade: cidade.name
		})
		localStorage.setItem("idCidade", cidade.id);
		localStorage.setItem("nameCidade", cidade.name);
	}

	render(){
		return(
			<div>
				<div className='mainDiv'>
					<div className='holder'>
						<div className='header'>
							<div className='logo'>
								<img src='/static/media/logo-white.jpg'/>
							</div>
						</div>
						<div className='contentPesquisa'>
							<div className='pesquisa'>
								<p className='titlePesquisa'>Descubra os melhores restaurantes em sua cidade</p>
								<Grid fluid>
									<Row gutter={6}>
										<Col sm={24} lg={17}>
											<InputGroup inside>
											    <InputGroup.Addon>
													<Icon icon="map-marker" />
											    </InputGroup.Addon>
												<Input 
													className='pesquisaInput'
													placeholder='Digite a sua cidade'
													value={this.state.nameCidade}
													onChange = {this.retornaCidade}
												/>
											</InputGroup>
											<div class='cidades'>
												{this.state.cidades.map((cidade, index) => (
													<div className='cidadeDisplay' onClick={() => this.setCidade(cidade)}>
														<p> {cidade.name}</p>
														<p> {cidade.state_name} </p>
													</div>
												))}
											</div>
										</Col>
										<Col sm={24} lg={7} >
											<Link style={{color: '#fff', textDecoration:'none'}} to='/lista'><Button color='green' className='buttonPesquisar'>BUSCAR</Button></Link>
										</Col>
									</Row>
								</Grid>
							</div>
						</div>
					</div>
				</div>
			</div>		
		)
	}
}

export default withRouter(Landing);
