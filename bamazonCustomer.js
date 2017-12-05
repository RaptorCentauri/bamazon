// TO DO:
// CHECK CUSTUMERQUANT AGAINST STOCK.
// PROVIDE TOTAL COST TO CUSTOMER






const mysql = require('mysql');
const inquirer = require('inquirer');

let connection = mysql.createConnection({
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
})

let wantedProduct;
let wantedQuantity;

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

displayProducts();



function checkQuantity(quant) {
					connection.query('SELECT * FROM products WHERE ?',{item_id: wantedProduct}, function(err, res){
						if(err) throw err;
						console.log(`IN STOCK: ${res[0].stock_quantity}`);
						console.log(`WANTED: ${quant}`);
						if (res[0].stock_quantity >= quant) {
							console.log(`You are going to purchase ${quant} ${res[0].product_name}`);
							console.log(`Your total cost is $${res[0].price * quant}`);
						}
						else {
							console.log(`There is not enough ${res[0].product_name} to fill that order`);
						}
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
		wantedQuantity = answers.CustomerQuant;

		console.log(wantedProduct);
		console.log(wantedQuantity);

				connection.query('SELECT * FROM products WHERE ?',{item_id: wantedProduct}, function(err, res){
					if(err) throw err;
					// console.log(res);
					checkQuantity(wantedQuantity);
				})

	});

}
