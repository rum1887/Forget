function showItems(){
    var x=document.getElementById("ls");
    console.log(x.style.display);
    if(x.style.display=="none"){
        x.style.display="block";
    }
    else{
        x.style.display="none";
    }
  }
  function sidebar(){
      var x=document.getElementById("mySidebar");
      if(x.style.display=="none"){
        x.style.display="block";
    }
    else{
        x.style.display="none";
    }
  }