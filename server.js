require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const PORT = process.env.PORT || 3006;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.status(200).json({ connected: true });
});


fs.readdirSync('./routes').map((route) => {
    if(route.split('.')[1] !== 'routes')
    app.use('/api',require(`./routes/` +route));
})

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
