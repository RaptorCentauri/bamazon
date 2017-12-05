const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "foot695&marl",
  database: "bamazon"
});

connection.connect(function(err){
	if(err) throw err;
	console.log(`Connected as id ${connection.threadId}`);
	console.log(`=================================================`);
})

function displayProducts(){
	connection.query('SELECT * FROM products', function(err, res){
		if(err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log(`ID: ${res[i].item_id}`);
			console.log(`NAME: ${res[i].product_name}`);
			console.log(`PRICE: $${res[i].price}`);
			console.log(`=================================================`);
		}

		chooseProduct();

	})

}

function chooseProduct() {
	inquirer.prompt([
		{
			type: "input",
			name: "CustomerResp",
			message: "Please enter the ID of the item you want to purchase.",
		},
		{
			type: "input",
			name: "CustomerQuant",
			message: "How many would you like?",
		}
	]).then(answers => {

		wantedProduct = answers.CustomerResp;
		wantedQuantity = parseInt(answers.CustomerQuant);

		connection.query('SELECT * FROM products WHERE ?',{item_id: wantedProduct}, function(err, res){
			if(err) throw err;
			checkQuantity(wantedQuantity);
		})

	});

}

function updateStock(newStock){
	connection.query(`UPDATE products SET stock_quantity=${newStock} WHERE ?`,{item_id: wantedProduct});
	connection.end();
}

function checkQuantity(quant) {
		connection.query('SELECT * FROM products WHERE ?',{item_id: wantedProduct}, function(err, res){
			if(err) throw err;
			if (res[0].stock_quantity >= quant) {
				console.log(`You are going to purchase ${quant} ${res[0].product_name}`);
				console.log(`Your total cost is $${res[0].price * quant}`);
				let stock_remaining = res[0].stock_quantity - quant;
				updateStock(stock_remaining);
			}
			else {
				console.log(`There is not enough ${res[0].product_name} to fill that order.`);
				connection.end();
			}
		})
}

let wantedProduct;
let wantedQuantity;

displayProducts();
