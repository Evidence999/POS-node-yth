var loadDatbase = require("./datbase.js");
var AllItems = loadDatbase.loadAllItems();
var Promotions = loadDatbase.loadPromotions();

module.exports = function printInventory(selectedItems) {
    // 生成购买Items数量的数组，在该测试用例下为[0,5,0,2,0,3]
    ItemsBuy = generateItemsBuy(selectedItems);
    // 生成打折的Items数组，由Promotions可得[1,1,0,0,0,1]
    ItemsDiscount = generateItemsDiscount(ItemsBuy); 
    // 生成打折后实际不需要支付的Items数量的数组，在该测试用例下为[0,1,0,0,0,1]
    ItemsNumDiscount = generateItemsNumDiscount(ItemsBuy, ItemsDiscount);
    
    // 生成ItemsBuyString,DiscountString和TailString
    ItemsBuyString = generateItemsBuyString(ItemsBuy, ItemsNumDiscount);
    DiscountString = generateDiscountString(ItemsNumDiscount);
    TailString = generateTailString(ItemsBuy, ItemsNumDiscount)
    console.log(ItemsBuyString + DiscountString + TailString);

    return '';
};

function generateItemsBuy(selectedItems) {
	// 生成购买Items数量的数组
    var ItemsNum = new Array(AllItems.length);
    for (var i=0; i<AllItems.length; ++i) {
  	    ItemsNum[i] = 0;
    }
    var num = selectedItems.length;
    var ItemName = '';
    var ItemNum = 0;
    for (var i=0;i<num;i++){ 
        ItemName = selectedItems[i].substr(0,10);
        ItemNum = 1;
        if (selectedItems[i].length>11) {
    	    ItemNum = parseFloat(selectedItems[i].substr(11,1));
        }
        for (var j=0;j<AllItems.length;j++){
    	    if (ItemName == AllItems[j].barcode){
    		    ItemsNum[j] += parseFloat(ItemNum);	
    	    }
        }
    }  
  return ItemsNum;
}

function generateItemsDiscount(ItemsBuy) {
	// 生成打折的Items数组
	var ItemsDiscount = new Array(AllItems.length);
	for (var i=0; i<AllItems.length; ++i) {
		ItemsDiscount[i] = 0;
    }
    for (var i=0; i<AllItems.length; ++i) {
    	for (var j=0; j<Promotions[0].barcodes.length; ++j) {
    		if (Promotions[0].barcodes[j] == AllItems[i].barcode) {
    			ItemsDiscount[i] = 1;
    		}
    	}
    }
    return ItemsDiscount;
}

function generateItemsNumDiscount(ItemsBuy, ItemsDiscount) {
	// 生成打折后实际需要支付的Items数量的数组
	var ItemsNumDiscount = new Array(AllItems.length);
	for (var i=0; i<AllItems.length; ++i) {
		ItemsNumDiscount[i] = 0;
    }
    for (var i=0; i<AllItems.length; ++i) {
    	if (ItemsBuy[i]>=3 && ItemsDiscount[i]>0) {
    		ItemsNumDiscount[i] = Math.floor(ItemsBuy[i] / 3); //向下整除 
    	}
    }
	return ItemsNumDiscount;
}

function generateItemsBuyString(ItemsBuy, ItemsNumDiscount) {
	// 生成ItemsBuyString
	var ItemsBuyString = '';
	ItemsBuyString += '***<没钱赚商店>购物清单***\n';
	for (var i=0; i<AllItems.length; ++i) {
		if (ItemsBuy[i]>0) {
			ItemsBuyString += '名称：';
			ItemsBuyString += AllItems[i].name;
			ItemsBuyString += '，数量：';
			ItemsBuyString += ItemsBuy[i];
			ItemsBuyString += AllItems[i].unit;
			ItemsBuyString += '，单价：';
			ItemsBuyString += parseFloat(AllItems[i].price).toFixed(2);
			ItemsBuyString += '(元)，小计：';
			ItemsBuyString += parseFloat((ItemsBuy[i]-ItemsNumDiscount[i])*AllItems[i].price).toFixed(2);
			ItemsBuyString += '(元)\n';
		}
	}
	return ItemsBuyString;
}

function sum(arr) {
  return eval(arr.join("+"));
};

function generateDiscountString(ItemsNumDiscount) {
	// 生成DiscountString
	if (sum(ItemsNumDiscount)==0) {
		return '';
	}
	var DiscountString = '';
	DiscountString += '----------------------\n';
	DiscountString += '挥泪赠送商品：\n';
	for (var i=0; i<AllItems.length; ++i) {
		if (ItemsNumDiscount[i]>0) {
			DiscountString += '名称：';
			DiscountString += AllItems[i].name;
			DiscountString += '，数量：';
			DiscountString += ItemsNumDiscount[i];
			DiscountString += AllItems[i].unit;
			DiscountString += '\n';
		}
	}
    return DiscountString;
}


function generateTailString(ItemsBuy, ItemsNumDiscount) {
	// 生成TailString
	var totalCost = 0;
	var savedCost = 0;
	var TailString = '';
	for (var i=0; i<AllItems.length; ++i) {
		if (ItemsBuy[i]>0) {
			totalCost += parseFloat((ItemsBuy[i]-ItemsNumDiscount[i])*AllItems[i].price);
			savedCost += parseFloat(ItemsNumDiscount[i]*AllItems[i].price);
		}
	}
    TailString += '----------------------\n';
    TailString += '总计：';
    TailString += totalCost.toFixed(2);
    TailString += '(元)\n';
    TailString += '节省：';
    TailString += savedCost.toFixed(2);
    TailString += '(元)\n';
    TailString += '**********************';
    return TailString;
}