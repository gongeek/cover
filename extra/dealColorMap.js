/**
 * Created by gongeek on 2015/5/21.
 */
var fs=require('fs');

var s=fs.readFileSync('Sichuan_Land30_1.clr','utf-8');
var arr= s.split(/\s/);
var i,j,arr2=[];
for(i=0;i<arr.length;i++){
	if(!!arr[i]){
		arr2.push(arr[i])
	}
}
var arr3=[];
for(j=0;j<arr2.length;j+=4){
	arr3.push([parseInt(arr2[j]),parseInt(arr2[j+1]),parseInt(arr2[j+2]),
		parseInt(arr2[j+3])]);
}
console.log(arr3);
