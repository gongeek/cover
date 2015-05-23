/**
 * Created by gongeek on 2015/5/24.
 */
$(document).ready(function () {


	var inputArr=$('.left').find('input');

	var i,nodeArr=[];
	for(i=0;i<inputArr.length;i++){
		nodeArr.push($(inputArr.eq(i).val()));
	}

	var j, k,postData,outerH,cid,coverDetail;

	for(j=0;j<nodeArr.length;j++){
		for(k=0;k<nodeArr[j].length;k++){


			outerH=nodeArr[j][k].outerHTML;

			cid=outerH.substring(outerH.indexOf('cid="')+5,outerH.indexOf('" des='));
			coverDetail=outerH.substring(outerH.indexOf('des="')+5,
						outerH.indexOf('" title='));

			postData={
				classCode:j,
				coverName:nodeArr[j][k].textContent,
				coverDetail:coverDetail
			};
			(function(postData){
				$.getJSON('http://localhost/proxy/proxy.php?http://globallandcover.com/Chinese/GLC30Download/ftp.ashx?' +
					'funName=ReturnCoordinate&Id='+cid).done(function(data){
					postData.lonLat=data[0];

					$.post('http://localhost/extra/coverData.php',postData);

				});
			})(postData);
		}
	}



});