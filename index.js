const express = require("express");
const pincodes = require("./Data/pincode");
const Compneydata = require("./Data/data")
 
const app = express();
app.use(express.json());
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
    //__dirname : It will resolve to your project folder.
  });
app.get("/:TypeofDelivery/:pin/:WeightinKg", (req, res) => 
{
    
    const pin = `${req.params.pin}`;
    const WeightinKg = +req.params.WeightinKg;
    const TypeofDelivery = req.params.TypeofDelivery;
    if (!validatePin(pin)) 
    {
        res.send({ "error": "Invalid PIN : Delivery not available on this pincode" });
    } 
    else {

        const zone = validatePin(pin);
        const cost = findCost(TypeofDelivery, zone, WeightinKg);
        res.send({ "totalCost": cost });
    }
})

function findCost(TypeofDelivery, zone, WeightinKg) {
    let roundedWeightinKg = Math.round(WeightinKg / 0.5) * 0.5;
    let multiples = roundedWeightinKg / 0.5;
    let additionalWeightinKgMultiples = multiples - 1;

    let finalcost1 = Compneydata[TypeofDelivery][zone].first;
    let finalcost2 = Compneydata[TypeofDelivery][zone].additional;

    if (multiples == 1) {
        return finalcost1;
    } else return finalcost1 + (finalcost2 * additionalWeightinKgMultiples);
}

function validatePin(pin) {
    let newP = pin.toString();
    if (pincodes[0][newP]) {
        return pincodes[0][newP];
    } else return false;
}

const Port = process.env.PORT || 1234;
app.listen(Port, function() {
    console.log("listening on", Port)
})