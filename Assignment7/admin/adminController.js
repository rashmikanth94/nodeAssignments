const express = require('express');
const router = express.Router();

const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static(__dirname+'/public'));
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/addUser', (req, res) => {
    res.render('login');
});

module.exports = router
