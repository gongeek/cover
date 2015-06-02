/**
 * Created by gongeek on 2015/5/26.
 */
var fs = require('fs');


var fileIndex = 0, s, dataArr, data2Arr, i, j, k,lineArr=[],countMap={},
	sumCount=0;
var fileCount=21;
var result='CITY_NAME,a10,a20,a30,a40,a50,a60,a70,a80,a90,a100\r\n';
var cityNameMap=[];

function to2(arr1){
	var arr2=[],i;
	for(i=1;i<arr1.length;i++){
		arr2.push(arr1[i].split(','))
	}
	return arr2;
}

function toCountMap(arr2){
	var countMap={};
	for(i=0;i<arr2.length;i++){
		countMap[arr2[i][1]]=arr2[i][2];
	}
	return countMap;
}

s=fs.readFileSync('./tableTxt/cityNameMap.txt','utf-8');
dataArr= s.split('\r\n');
data2Arr=to2(dataArr);
for(i=0;i<data2Arr.length;i++){
		cityNameMap.push(data2Arr[i][10]);
}


for (fileIndex=0; fileIndex < fileCount; fileIndex++) {
	sumCount=0;
	s = fs.readFileSync('./tableTxt/' + fileIndex + '.txt', 'utf-8');
	dataArr = s.split('\r\n');
	data2Arr =to2(dataArr);
	countMap=toCountMap(data2Arr);
	lineArr=[];
	lineArr.push(cityNameMap[fileIndex]);

	for(k=10;k<=100;k+=10){
		if(countMap[k]){
			sumCount+=parseInt(countMap[k]);
		}
	}

	for(k=10;k<=100;k+=10){
		if(countMap[k]){
			lineArr.push((parseInt(countMap[k])*100/sumCount).toFixed(2));
		}else{
			lineArr.push(0);
		}
	}
	result+=lineArr.join(',')+'\r\n';
}



fs. writeFile('./tableTxt/resultTab.txt' , result , function (err) {
	if (err) throw err;
	console. log('It\' s saved!' );
});


