	var musiclist=["vedio/Naomi & Goro - Top Of The World.mp3",
			"vedio/Charlie Landsborough - Auld Lang Syne.mp3",
			"vedio/Johnny Hates Jazz - Turn Back the Clock - 12＂ Extended Mix.mp3",
			];
			//获取界面元素
			//js可行，src切换有效，jq有问题
			$music=document.getElementById('music');
			
			$btnPlay=$('#play');
			$btnPre=$('#pre');
			$btnNext=$('#next');
			$chosMode=$('#chooseMode');	
			$modes=$("#modes li");
			$rotate=$("#line1");
			$z=$('.z');
			$eye=$('.circle');
			$words=$('.muswords');
			
			//定义变量
			var pos=0;
			var onlyOne=true;
			var	time1=null;
			var jude=false;
			//歌曲播放模式
			$($modes[0]).click(function(){
				var stop1=clearInterval(time1);
					onlyOne=true;
				$music.loop=true;
			});
			$($modes[1]).click(function(){
				if(onlyOne){
					onlyOne=false;
					time1=setInterval(function(){
						if($music.ended){
							pos++;
							if(pos==$music.length-1)
							pos=0;
							$btnNext.click();
							
						}
					
					},1000);
				}	
			});
			$chosMode.on('mouseover',function(){
				$("#modes li").css('display','block');
			});
			$chosMode.on('mouseleave',function(){
				$("#modes").css('display','none');
			});
			
			
			//暂停，播放
			var launch=true;
			$btnPlay.click(function(){
				if(launch){
					rotatePlay();
					readWordsTime();
					launch=false;
				}
				var state=($btnPlay.text()=="play")?$($eye[1]).click():$($eye[0]).click();
				
			});
			//eye 点击事件
			$($eye[0]).click(function(){
			   eyeKey($eye[1],$eye[0],'paused');	
			});
			
			$($eye[1]).click(function(){
				if(launch){
					rotatePlay();
					launch=false;
				}
				eyeKey($eye[0],$eye[1],'running');	
			});
			//eye 点击事件实现方法
			function eyeKey(obj1,obj2,state){
				$(obj1).css('display','block');
				$(obj2).css('display','none');
				playOrpause();
				rotateState(state);
			}
			
			//实现音乐暂停或播放
			function playOrpause(){
				if($btnPlay.text()=="play"){
					$music.play();
					$btnPlay.text("pause");
				}
				else{
					$music.pause();
					$btnPlay.text("play");
				}
			}
			
			//上一曲，下一曲
			$btnPre.on('click',function(){
				pos--;
				musicPlay();
			});
			$btnNext.on('click',function(){
				pos++;
				musicPlay();
			});
			//上一曲或下一曲实现方法
			function musicPlay(){
				readWordsTime();
				$music.pause();	
				$music.currentTime=0;
				if(pos<0){
					pos=musiclist.length-1;
				}
				else if(pos==musiclist.length){
					pos=0;
				}
				$music.src=musiclist[pos];
				$($music).css('src',musiclist[pos]);
				$music.play();
				rotateState('running');
			}
			
			//呼噜点击事件
			$($z[0]).click(function(){
				$($eye[1]).click();
			});
			

			
			//呼噜
			sleep();
			function sleep(){
				$($z[0]).css({
					
					'animation-name':'mySecond ',
					'animation-duration': '4s',
					'animation-iteration-count':'infinite',
					'animation-timing-function':'cubic-bezier(.46,.1,.97,.99)',
					'animation-direction':'alternate',
					'-webkit-animation-direction':'alternate',
	
					'-webkit-animation-name':'mySecond ',
					'-webkit-animation-duration': '4s',
					'-webkit-animation-iteration-count':'infinite',
					'-webkit-animation-timing-function':'cubic-bezier(.46,.1,.97,.99)'
				});
			}
			//呼噜状态
			function sleepState(state,state2){

					$($z[0]).css({		
						'display':state2,
						'animation-play-state':state,
						'-webkit-animation-play-state':state
					})
			}
			//rotatePlay();
			//鼻子旋转
			function rotatePlay(){
				sleepState('paused','none');
				var time1=setTimeout(function(){
					drawArc();
				},1000);
				$($rotate).css({
					'animation-name':'myfirst ',
					'animation-duration': '4s',
					'animation-iteration-count':'infinite',
					'animation-timing-function':'linear',
					'-webkit-animation-name':'myfirst ',
					'-webkit-animation-duration': '4s',
					'-webkit-animation-iteration-count':'infinite',
					'-webkit-animation-timing-function':'linear'
				});
			}
			//鼻子旋转状态,Smile
			function rotateState(state){
				$($rotate).css({
					'animation-play-state':state,
					'-webkit-animation-play-state':state
				});
				$('#plate').css({
					'animation-play-state':state,
					'-webkit-animation-play-state':state
				})
			}
			//歌词匹配
			var wordsList=["words/Naomi & Goro - Top Of The World.txt",
			"words/auldLangSyne.txt",
			"words/turn back the clock.txt"];
			var times=new Array();
			var rows=new Array();
			var words=new Array();
			var timeWord;
			function readWordsTime(){
				//清空队列
				times.splice(0);
				rows.splice(0);
				words.splice(0);
				var stop=clearInterval(timeWord);
				//读取歌词和时间
				$.get(wordsList[pos],function(data){
		        var pattern = /\[*:*.*]/g;
		        times=data.match(pattern);
		        rows=data.split('\r');
		        var a,b,c; 
		        for(var i=0;i<times.length;i++){
		        	words[i]=rows[i].replace(times[i],'');	
		        }
	           	for(var i=0;i<times.length;i++){
		        	a=parseInt(times[i].substring(1,3))*60;
		        	b=parseInt(times[i].substring(4,6));
		        	c=parseFloat(times[i].substring(7,9))*0.01;
		        	times[i]=parseFloat(a+b+c);
			    }
	           	console.log(times.length+" "+rows.length+" "+words.length);
		   	       matchWords();
		   	 });  
			}
		    //匹配歌词 
		    function matchWords(){
		    	var wordpos=0;
		    	var try2=0;
		    	timeWord=setInterval(function(){
		    		if(parseInt($music.currentTime)==parseInt(times[wordpos])){
		    			$($words[0]).text(words[wordpos]).css('color','green');
		    			$($words[1]).text(words[wordpos+1]);
		    			wordpos++;
		    		}
		    	},1000);
		    }  
		    //Smile
			var ocan=document.getElementById('musicSmile');
			var ctx=ocan.getContext("2d");
			var colorGradient=ctx.createLinearGradient(20,20,20,100);
			colorGradient.addColorStop(0,"pink");
			colorGradient.addColorStop(0.5,"orange");
			colorGradient.addColorStop(1,"darkgreen");
			ctx.fillStyle=colorGradient;
			ctx.strokeStyle=colorGradient;
			ctx.lineWidth=4;
			ctx.arc(148,-47,195,(parseFloat(1/4)*Math.PI),parseFloat(3/4)*Math.PI);
			ctx.stroke();
			
			function drawArc(){
				$('#plate').css({
					'animation-name':'mySmile',
					'animation-duration': '2s',
					'animation-timing-function': 'linear',
					'animation-direction': 'alternate',
				
					'-webkit-animation-name':'mySmile',
					'-webkit-animation-duration': '2s',
					'-webkit-animation-timing-function': 'linear',
					'-webkit-animation-direction': 'alternate',
					'-webkit-animation-iteration-count':'infinite',
				})
			}