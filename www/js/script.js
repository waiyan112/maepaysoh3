$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;    	
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
        var networkState = navigator.network.connection.type;
        if(networkState !='0' || networkState !='none')
        {
        	window.internet = true;
        }else
        {
        	window.internet = false;
        }
    } else {
        onDeviceReady();
        
    }
});

function onDeviceReady() {

var db = window.openDatabase("vote", "1.0", "vote", "10000");



var url = "http://vote.mmappbuilder.com/admin/index.php";
//var url = "http://localhost/vote/admin/index.php";
var state = '';
	var per_page = 10;
	var page = 1;
	localStorage.setItem("candidatePage",1);
	localStorage.setItem("partyPage",1);
	localStorage.setItem("state","rest");
	var legislature = 'all';
	var party = 'all';
	var gender = 'all';
	install();

	$(".partylists").click(function(){
		$(".loadingImage").css("display","block");
		getPartyLists(per_page,page);
	});

	$(".candidateLists").click(function(){	
		$(".loadingImage").css("display","block");
		getCandidateLists(per_page,page,legislature,party,gender);
	});




	function install()
	{
		var intstallProcess = localStorage.getItem('install');
		
		if(intstallProcess != 'successInstall')
		{
			db.transaction(populateDB, errorCB, successCB);

				function populateDB(tx)
				{
						//for party
						tx.executeSql('DROP TABLE IF EXISTS Party');
						tx.executeSql('DROP TABLE IF EXISTS Leadership');
						tx.executeSql('DROP TABLE IF EXISTS chairman');
						tx.executeSql('DROP TABLE IF EXISTS contact');
				        tx.executeSql('CREATE TABLE IF NOT EXISTS Party (id,party_name,abbreviation,member_count,approved_party_number,region,party_flag,party_seal,headquarters,policy,updated_at)');
				        tx.executeSql('CREATE TABLE IF NOT EXISTS Leadership (Lname,party_id)');
				        tx.executeSql('CREATE TABLE IF NOT EXISTS chairman (Cname,party_id)');
				        tx.executeSql('CREATE TABLE IF NOT EXISTS contact (contact,party_id)');
				        //for party
				        tx.executeSql('DROP TABLE IF EXISTS Candidate');
				        tx.executeSql('CREATE TABLE IF NOT EXISTS Candidate(id,name,party_id,mpid,gender,photo_url,legislature,birthdate,education,occupation,ethnicity,religion,ward_village,mother_name,mother_religion,father_name,father_religion)');

				      	tx.executeSql('DROP TABLE IF EXISTS constituency');
				      	tx.executeSql('CREATE TABLE IF NOT EXISTS constituency(name,number,ST_PCODE,DT_PCODE,TS_PCODE,AM_PCODE,parent,canId)');

				       
				    for(var inID = 1; inID < 17; inID++)
				    {
				       $.getJSON("js/candidate-"+inID+".json",function(candidate){
				       
				       		db.transaction(function(tx){
				       			for(var i=0;i<candidate.meta.pagination.count;i++){
				       				var id = candidate.data[i].id;
				       				var name = candidate.data[i].name;
				       				var party_id = candidate.data[i].party_id;
				       				var mpid = candidate.data[i].mpid;
				       				var gender = candidate.data[i].gender;
				       				var photo_url = candidate.data[i].photo_url;
				       				var legislature = candidate.data[i].legislature;
				       				var birthdate = candidate.data[i].birthdate;
				       				var education = candidate.data[i].education;
				       				var occupation = candidate.data[i].occupation;
				       				var ethnicity = candidate.data[i].ethnicity;
				       				var religion = candidate.data[i].religion;
				       				var ward_village = candidate.data[i].ward_village;
				       				var mother_name = candidate.data[i].mother.name;
				       				var mother_religion = candidate.data[i].mother.religion;
				       				var father_name = candidate.data[i].father.name;
				       				var father_religion = candidate.data[i].father.religion;	
				       				

				       				if(candidate.data[i].constituency.name != '')
				       				{
				       					var constituencyName = candidate.data[i].constituency.name;
				       					var constituencyNumber = candidate.data[i].constituency.number;
				       					var constituencyST_PCODE = candidate.data[i].constituency.ST_PCODE;
				       					var constituencyDT_PCODE = candidate.data[i].constituency.DT_PCODE;
				       					var constituencyTS_PCODE = candidate.data[i].constituency.TS_PCODE;
				       					var constituencyAM_PCODE = candidate.data[i].constituency.AM_PCODE;
				       					var constituencyparent = candidate.data[i].constituency.parent;					
				       					



				    					

				       					tx.executeSql('INSERT INTO constituency (name,number,ST_PCODE,DT_PCODE,TS_PCODE,AM_PCODE,parent,canId) VALUES (?,?,?,?,?,?,?,?)',[constituencyName,constituencyNumber,constituencyST_PCODE,constituencyDT_PCODE,constituencyTS_PCODE,constituencyAM_PCODE,constituencyparent,id]);
				       				}			       			

				       				tx.executeSql('INSERT INTO Candidate (id,name,party_id,mpid,gender,photo_url,legislature,birthdate,education,occupation,ethnicity,religion,ward_village,mother_name,mother_religion,father_name,father_religion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[id,name,party_id,mpid,gender,photo_url,legislature,birthdate,education,occupation,ethnicity,religion,ward_village,mother_name,mother_religion,father_name,father_religion]);
				       			}
									
				       		});
				       });
				    }

//after install

	
				       $.getJSON( "js/party.json", function(data) {
				       			db.transaction(function(tx){
			       		  		
						       		for(var i = 0; i<data.data.length;i++)
						       		{

						       			var id = data.data[i].id;				       			 
						       			var party_name = data.data[i].party_name;				       			 
						       			var abbreviation = data.data[i].abbreviation;
						       			var member_count = data.data[i].member_count;
						       			var approved_party_number = data.data[i].approved_party_number;	
						       			var region = data.data[i].region;	
						       			var party_flag = data.data[i].party_flag;	
						       			var party_seal = data.data[i].party_seal;	
						       			var headquarters = data.data[i].headquarters;	
						       			var policy = data.data[i].policy;	
						       			var updated_at = data.data[i].updated_at;	
						       			for(var l = 0;l<data.data[i].leadership.length;l++)
						       			{
						       				var Lname = data.data[i].leadership[l];
						       				tx.executeSql('INSERT INTO Leadership (Lname,party_id) VALUES (?,?)',[Lname,id]);
						       			}

						       			for(var C = 0;C<data.data[i].chairman.length;C++)
						       			{
						       				var Cname = data.data[i].chairman[C];
						       				tx.executeSql('INSERT INTO chairman (Cname,party_id) VALUES (?,?)',[Cname,id]);
						       			}
						       			for(var con = 0;con<data.data[i].chairman.length;con++)
						       			{
						       				var contact = data.data[i].contact[con];
						       				tx.executeSql('INSERT INTO contact (contact,party_id) VALUES (?,?)',[contact,id]);
						       			}
						       			
						       			tx.executeSql('INSERT INTO Party (id,party_name,abbreviation,member_count,approved_party_number,region,party_flag,party_seal,headquarters,policy,updated_at) 	VALUES (?,?,?,?,?,?,?,?,?,?,?)'
						       				,[id,party_name,abbreviation,member_count,approved_party_number,region,party_flag,party_seal,headquarters,policy,updated_at]);
						       		}
				       			});     
				       });

				
				}
				function errorCB()
				{

				}
				function successCB()
				{

				}
				 localStorage.setItem('install','successInstall');

		}
	}



	var state = localStorage.getItem("state");	

	$(document).on("pagecreate","#party",function(){
		
			$(this).on("scrollstart",function(){

			db.transaction(function(tx){
				tx.executeSql("SELECT * FROM Party",[],function(tx,results){
					localStorage.setItem("totalParty",results.rows.length);					

					});
			});	
				page = localStorage.getItem("partyPage");	
				var totalParty = localStorage.getItem("totalParty");
				if(state == 'rest' && parseInt(totalParty)/parseInt(per_page) >= parseInt(page))
				{							
					$(".loadingImage").css("display","block");
					
					page = parseInt(page)+1;
					getPartyLists(per_page,page);
 	 			}
 	 		});
		});
	$(document).on("pagecreate","#candidate",function(){

			$(this).on("scrollstart",function(){	
			db.transaction(function(tx){
				tx.executeSql("SELECT * FROM Candidate",[],function(tx,results){
					localStorage.setItem("totalCandidate",results.rows.length);
							

					});
			});		
			var totalCandidate = localStorage.getItem("totalCandidate");	
				if(state == 'rest' && parseInt(totalCandidate)/parseInt(per_page) >= parseInt(page))
				{							
					page = localStorage.getItem("candidatePage");	
					page = parseInt(page)+1;
					$(".loadingImage").css("display","block");
 	 				getCandidateLists(per_page,page,legislature,party,gender);
 	 			}
 	 		});
	});



	$(document).on("click",".singlecandidate",function(){
		$(".loadingImagedetail").css("display","block");
		var id = $(this).data("id");
		getsingleCandidate(id);
	}); 

	$(document).on("click",".singleparty",function(){
		$(".loadingImagedetail").css("display","block");
		var id = $(this).data("party-id");
		console.log(id);
		getsingleParty(id);
	}); 

	function getsingleParty(id)
	{
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM Party WHERE id=?",[id],function(tx,results){
				
				var partyData = '';
				var party_id = results.rows.item(0).id;
				$("#partydetailData").html("");
				$(".loadingImagedetail").css("display","none");
				$("#partyLogoImage").attr("src",results.rows.item(0).party_flag);
				$("#partyTitle").html(results.rows.item(0).party_name);

				if(results.rows.item(0).abbreviation !='')
				{
					partyData +='<li data-role="list-divider" >အမည္အတိုေကာက္ : <span>'+ results.rows.item(0).abbreviation+'</span></li>';
				}

				if(results.rows.item(0).member_count !='')
				{
					partyData +='<li data-role="list-divider" >မန္ဘာအေရအတြက္ : <span>'+ results.rows.item(0).member_count+'</span></li>';
				}
				
				var Leader='';
				db.transaction(function(partyLeader){
					partyLeader.executeSql("SELECT * FROM Leadership WHERE party_id=?",[party_id],function(tx,results){						
						if(results.rows.length > 0)
						{
							Leader +='<li data-role="list-divider" >ပါတီေခါင္းေဆာင္မ်ား</li>';
							for(var i=0; i<results.rows.length;i++)
							{							
								Leader += '<li>'+results.rows.item(i).Lname+'</li>';

							}					
							$("#partydetailData").append(Leader);
							$("ul#partydetailData").listview().listview('refresh');
						}
					});
				});

				var chairmanData = '';
				db.transaction(function(chairman){
					chairman.executeSql("SELECT * FROM chairman WHERE party_id=?",[party_id],function(tx,results){
						if(results.rows.length > 0)
						{
							chairmanData +='<li data-role="list-divider" >ပါတီဥကၠဌ</li>';
							for(var i=0; i<results.rows.length;i++)
							{
								chairmanData += '<li>'+results.rows.item(i).Cname+'</li>';
							}
							$("#partydetailData").append(chairmanData);
							$("ul#partydetailData").listview().listview('refresh');
						}
					});
				});

				
			

				if(results.rows.item(0).party_seal != '')
				{
					partyData +='<li data-role="list-divider" >ပါတီတံဆိပ္</li>';
					partyData += '<li><img src="'+results.rows.item(0).party_seal+'" /></li>';
				}

				if(results.rows.item(0).region != '')
				{
					partyData +='<li data-role="list-divider" >မဲဆႏၵနယ္</li>';
					partyData += '<li>'+results.rows.item(0).region+'</li>';
				}	

				if(results.rows.item(0).headquarters != '')
				{
					partyData +='<li data-role="list-divider" >တည္ေနရာ</li>';
					partyData += '<li><p style="white-space:normal;padding:10px;">'+results.rows.item(0).headquarters+'</p></li>';
				}
				var contactData = '';
				db.transaction(function(contact){
					contact.executeSql("SELECT * FROM contact WHERE party_id=?",[party_id],function(tx,results){
					if(results.rows.length != 0)
						{
							contactData +='<li data-role="list-divider" >ဆက္သြယ္ရန္</li>';
							for(var i=0; i<results.rows.length;i++)
							{
								contactData += '<li><a href="tel:'+results.rows.item(i).contact+'">'+results.rows.item(i).contact+'</a></li>';
							}
							$("#partydetailData").append(contactData);
							$("ul#partydetailData").listview().listview('refresh');
						}
					});
				});

				/*	
				if(data.data.policy != '')
				{
					partyData +='<li data-role="list-divider" >ပါတီ မူဝါဒ</li>';
					partyData += '<li><a href="'+data.data.policy+'">Download</a></li>';					
				}
				*/
				

				$("#partydetailData").append(partyData);
				$("ul#partydetailData").listview().listview('refresh');
			});
		});


	}

	function getsingleCandidate(id)
	{
				db.transaction(function(tx){

				

				tx.executeSql("SELECT * FROM Candidate WHERE id=?",[id],function(tx,results){	
				var partyId = results.rows.item(0).party_id;				
				
				$(".loadingImagedetail").css("display","none");
				$("#singleCandidateName").html(results.rows.item(0).name);				
				$("#singleCandidateName1").html(results.rows.item(0).name);				
				$("#singlelegislature").html(results.rows.item(0).legislature);
				$("#singlelegislature1").html(results.rows.item(0).legislature);
				$("#singleeducation").html(results.rows.item(0).education);
				$("#singleeducation1").html(results.rows.item(0).education);
				$("#singleoccupation").html(results.rows.item(0).occupation);
				$("#singleoccupation1").html(results.rows.item(0).occupation);
				$("#singleethnicity").html(results.rows.item(0).ethnicity);
				$("#singleward_village").html(results.rows.item(0).ward_village);

				db.transaction(function(con){
					con.executeSql("SELECT * FROM constituency WHERE canId=?",[id],function(tx,conResults){
							$("#singleconstituencyName").html(conResults.rows.item(0).name);
							$("#singleconstituencyName1").html(conResults.rows.item(0).name);
							$("#singleconstituencyParent").html(conResults.rows.item(0).parent);
							$("#singleconstituencyParent1").html(conResults.rows.item(0).parent);
					});
				});

				$("#singleMotherName").html(results.rows.item(0).mother_name);
				$("#singleMotherReligion").html(results.rows.item(0).mother_religion);	
				$("#singleFatherName").html(results.rows.item(0).father_name);
				$("#singleFatherReligion").html(results.rows.item(0).father_religion);

				db.transaction(function(party){
					party.executeSql("SELECT * FROM Party WHERE id=?",[partyId],function(tx,conResults){
						if(conResults.rows.length>0)
						{
							localStorage.setItem("policy",null);
							$("#singlePartyParty_Name").html(conResults.rows.item(0).party_name);
							$("#singlePartyParty_Name1").html(conResults.rows.item(0).party_name);
							$("#singlePartyMember_count").html(conResults.rows.item(0).member_count);	
							$("#singlePartyheadquarters").html(conResults.rows.item(0).headquarters);
							 PartyPolicy = conResults.rows.item(0).policy;
							 localStorage.setItem("policy",PartyPolicy);
						}else
						{
							$("#singledetailPartyLeader").html("");
						}
						

					});
				});


				

				db.transaction(function(party){
					party.executeSql("SELECT * FROM Leadership WHERE party_id=?",[partyId],function(tx,leaderResults){
						if(leaderResults.rows.length>0)
						{
							console.log('asdf');
							var leader = '<li data-role="list-divider">Leaders</li>';
							for(var i = 0; i<leaderResults.rows.length; i++)
							{
								leader += '<li><span>'+leaderResults.rows.item(i).Lname+'</span></li>';
							}
							$("#singledetailPartyLeader").html(leader);
							$("ul#singledetailPartyLeader").listview().listview('refresh');
						}
					});
				});


				db.transaction(function(chairman){
					chairman.executeSql("SELECT * FROM chairman WHERE party_id=?",[partyId],function(tx,results){
						if(results.rows.length>0)
						{
							var chairman = '<li data-role="list-divider">Chairman</li>';
							for(var i = 0; i<results.rows.length; i++)
							{
								chairman += '<li><span>'+results.rows.item(i).Cname+'</span></li>';
							}
							$("#singledetailPartyLeader").html(chairman);
							$("ul#singledetailPartyLeader").listview().listview('refresh');
						}
					
					});
				});

				db.transaction(function(contact){
					contact.executeSql("SELECT * FROM contact WHERE party_id=?",[partyId],function(tx,results){
						if(results.rows.length>0)
							{
								$("#singlepartyContact").html("");
								var contact = '<li data-role="list-divider">Contact</li>';
								for(var i = 0; i<results.rows.length; i++)
								{
									contact += '<li><span><a href="tel:'+results.rows.item(i).contact+'">'+results.rows.item(i).contact+'</a></span></li>';
								}
								$("#singlepartyContact").append(contact);
								$("ul#singlepartyContact").listview().listview('refresh');
							}

					});
				});
				var PartyPolicy = localStorage.getItem("policy");			
				if(PartyPolicy != '')
				{
					console.log('info exists');
					var info = '<li data-role="list-divider">Info</li>';

						info += '<li><span><a href="'+PartyPolicy+'">Download</a></span></li>';
			
					$("#singlepartyContact").append(info);
					$("ul#singlepartyContact").listview().listview('refresh');
				}

				$("#singleCandidatePhotourl").attr("src",results.rows.item(0).photo_url);	
				
					});
});
		/*
		$.ajax({
			url : url+"/api/candidate/singleCandidate/"+id,
			success : function(q)
			{
				$(".loadingImagedetail").css("display","none");
				var data = $.parseJSON(q);
				$("#singleCandidateName").html(data.data.name);
				$("#singlelegislature").html(data.data.legislature);
				$("#singleeducation").html(data.data.education);
				$("#singleoccupation").html(data.data.occupation);
				$("#singleethnicity").html(data.data.ethnicity);
				$("#singleward_village").html(data.data.ward_village);
				$("#singleconstituencyName").html(data.data.constituency.name);
				$("#singleconstituencyParent").html(data.data.constituency.parent);
				$("#singleMotherName").html(data.data.mother.name);
				$("#singleMotherReligion").html(data.data.mother.religion);	
				$("#singleFatherName").html(data.data.father.name);
				$("#singleFatherReligion").html(data.data.father.religion);

				$("#singlePartyParty_Name").html(data.data.party.party_name);
				$("#singlePartyMember_count").html(data.data.party.member_count);	
				$("#singlePartyheadquarters").html(data.data.party.headquarters);
				$("#singledetailPartyLeader").html("");

				if(data.data.party.leadership.length>0)
				{

					var leader = '<li data-role="list-divider">Leaders</li>';
					for(var i = 0; i<data.data.party.leadership.length; i++)
					{
						leader += '<li><span>'+data.data.party.leadership[i]+'</span></li>';
					}
					$("#singledetailPartyLeader").append(leader);
					$("ul#singledetailPartyLeader").listview().listview('refresh');
				}
				if(data.data.party.chairman.length>0)
				{
					var chairman = '<li data-role="list-divider">Chairman</li>';
					for(var i = 0; i<data.data.party.chairman.length; i++)
					{
						chairman += '<li><span>'+data.data.party.chairman[i]+'</span></li>';
					}
					$("#singledetailPartyLeader").append(chairman);
					$("ul#singledetailPartyLeader").listview().listview('refresh');
				}
				if(data.data.party.contact.length>0)
				{
					$("#singlepartyContact").html("");
					var contact = '<li data-role="list-divider">Contact</li>';
					for(var i = 0; i<data.data.party.contact.length; i++)
					{
						contact += '<li><span><a href="tel:'+data.data.party.contact[i]+'">'+data.data.party.contact[i]+'</a></span></li>';
					}
					$("#singlepartyContact").append(contact);
					$("ul#singlepartyContact").listview().listview('refresh');
				}
				if(data.data.party.policy != null)
				{
					var info = '<li data-role="list-divider">Info</li>';

						info += '<li><span><a href="'+data.data.party.policy+'">Download</a></span></li>';
			
					$("#singlepartyContact").append(info);
					$("ul#singlepartyContact").listview().listview('refresh');
				}

				$("#singleCandidatePhotourl").attr("src",data.data.photo_url);
			}
		});
	*/
	}

	function getCandidateLists(per_page,page,legislature,party,gender)
	{

		localStorage.setItem("state","download");	
		var current_page = localStorage.getItem("candidatePage");


		console.log('true');
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM Candidate LIMIT ?,?",[page,per_page],function(tx,results){	
				$(".loadingImage").css("display","none");
				localStorage.setItem("state","rest");	
				/*
				var data = $.parseJSON(q);
				var total = data.meta.pagination.total;
				var count = data.meta.pagination.count;
				var current_page = data.meta.pagination.current_page;
				var total_page = data.meta.pagination.total_page;
				*/
				
				//localStorage.setItem("candidateTotalPage",total_page);

				var output = '';
				for(var i=0;i<results.rows.length;i++)
				{		
					localStorage.setItem("candidatePage",page);		
					output += '<li class="singlecandidate" data-id="'+results.rows.item(i).id+'">';
					output +='<a  href="#singlecandidatepage">';
					output += '<img src="'+results.rows.item(i).photo_url+'" alt="photo">';
					output += results.rows.item(i).name;
					output += '</a></li>' ; 
				}
				$("#candidateLists").append(output);
				var output = '';
				$("ul#candidateLists").listview().listview('refresh');			
			});			
		});
	
		/*
		localStorage.setItem("state","download");	
		var current_page = localStorage.getItem("candidatePage");
		if(current_page != 'NaN')
		{
			page = parseInt(current_page)+1;
			
		}


		$.ajax({
			url : url+"/api/candidate/candidateLists?per_page="+per_page+"&page="+page+"&legislature="+legislature+"&party="+party+"&gender="+gender,
			success: function(q)
			{
				$(".loadingImage").css("display","none");
				localStorage.setItem("state","rest");	
				var data = $.parseJSON(q);
				var total = data.meta.pagination.total;
				var count = data.meta.pagination.count;
				var current_page = data.meta.pagination.current_page;
				var total_page = data.meta.pagination.total_page;

				localStorage.setItem("candidatePage",current_page);
				localStorage.setItem("candidateTotalPage",total_page);
				var output = '';
				for(var i=0;i<data.data.length;i++)
				{					
					output += '<li class="singlecandidate" data-id="'+data.data[i].id+'">';
					output +='<a  href="#singlecandidatepage">';
					output += '<img src="'+data.data[i].photo_url+'" alt="photo">';
					output += data.data[i].name;
					output += '</a></li>' ; 
				}
				$("#candidateLists").append(output);
				$("ul#candidateLists").listview().listview('refresh');
			}
		});
*/
	}


	function getPartyLists(per_page,page)
	{

		  localStorage.setItem("state",'downloading');
		  /*	
			db.transaction(function(tx){
			tx.executeSql("SELECT * FROM Party LIMIT ?,?",[page,per_page],function(tx,results){	

				$(".loadingImage").css("display","none");	
				localStorage.setItem("state",'rest');	
				localStorage.setItem("partyPage",page);	
				var output = '';
				for(var i=0;i<results.rows.length;i++)
				{
					output += '<li class="singleparty" data-party-id="'+results.rows.item(i).id+'">';
					output +='<a href="#partydetail">';
					output += '<img src="'+results.rows.item(i).party_flag+'" alt="Paty Flag">';
					output += results.rows.item(i).party_name;
					output += '</a></li>' ; 
				}				
				$("#partylistdata").append(output);
				var output = '';
				$("ul#partylistdata").listview().listview('refresh');
			});
			});
			*/
			

			$.ajax({
			url: url+"/api/party/partyLists?per_page="+per_page+"&page="+page,        
			success:function(q){
				$(".loadingImage").css("display","none");
				var data = $.parseJSON(q);
				var count = data._meta.count;
				var current_page = data._meta.current_page;
				localStorage.setItem("state",'rest');	
				localStorage.setItem("partyPage",current_page);	
				var output = '';
				for(var i=0;i<data.data.length;i++)
				{
					output += '<li class="singleparty" data-party-id="'+data.data[i].id+'">';
					output +='<a href="#partydetail">';
					output += '<img src="'+data.data[i].party_flag+'" alt="Paty Flag">';
					output += data.data[i].party_name;
					output += '</a></li>' ; 
				}
				$("#partylistdata").append(output);
				$("ul#partylistdata").listview().listview('refresh');

		}
		});
			
	}
}


