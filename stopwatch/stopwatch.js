useStopWatch = function(_pid){

    const zeroPadding = (num,length) =>{
        return ('0000000000' + num).slice(-length);
    }

    const dom = (attribute) => {
        return $("#winc" + _pid + " " + attribute);
    }

    class Stopwatch{
        constructor(_pid){
            this.pid = _pid;
            this.interval_id = 0;
            this.current_time_accumulate_ms = 0; // 蓄積時間
            this.tmp_stoped_ms = 0;
            this.last_lap_time = 0;
            this.start_time_ms = 0;
        }

        currentSum(){
            return this.tmp_stoped_ms + this.current_time_accumulate_ms;
        }

        // 時間をhh:mm:ss.(ms)
        formatTime(ms_got){
            const ms = ms_got % 1000;
            const tolal_secs_without_ms = (ms_got - ms) / 1000;
            const hour = (tolal_secs_without_ms - (tolal_secs_without_ms % 3600)) / 3600 || 0;
            const min = ((tolal_secs_without_ms - hour * 3600) - ((tolal_secs_without_ms - hour * 3600) % 60)) / 60 || 0;
            const sec = tolal_secs_without_ms - hour * 3600 - min * 60;
            return zeroPadding(hour,2) + ":" +zeroPadding(min,2) + ":" + zeroPadding(sec,2) + "." + zeroPadding(ms,2);
        }

        start(){
            if(isNaN(this.current_time_accumulate_ms)) this.current_time_accumulate_ms = 0;
            this.start_time_ms = Date.now();
            this.interval_id = setInterval("stopwatch"+this.pid+".update()", 10);
        }

        stop(){
            clearInterval(this.interval_id);
            this.current_time_accumulate_ms = Date.now() - this.start_time_ms;
            this.tmp_stoped_ms += this.current_time_accumulate_ms;
        }
         
        update(){
            //console.log(this);
            this.current_time_accumulate_ms = Date.now() - this.start_time_ms;
            dom(".show").text(this.formatTime(this.currentSum()));
        }

        reset(){
            this.stop();
            this.current_time_accumulate_ms = 0; // 蓄積時間
            this.tmp_stoped_ms = 0;
            this.last_lap_time = 0;
            this.start_time_ms = 0;
            dom(".laps").html("");
            dom(".show").text("00:00:00.0");
        }

        addLap(){
            dom(".laps").prepend("<li>"+this.formatTime(this.currentSum() - this.last_lap_time)+"</li>");
            this.last_lap_time = this.currentSum();
        }
    }
    eval("stopwatch"+_pid+"= new Stopwatch("+_pid+");");
    console.log(eval("stopwatch"+_pid));

    dom(".start").on("click", function(){
        eval("stopwatch"+_pid+".start();");

        // ボタン入れ替え
        dom(".start").addClass("hidden");
        dom(".stop").removeClass("hidden");
        dom(".lap").removeClass("hidden");
        dom(".laps").removeClass("hidden");
    });

    dom(".stop").on("click", function(){
        eval("stopwatch"+_pid+".stop();");

        // ボタン入れ替え
        dom(".stop").addClass("hidden");
        dom(".start").removeClass("hidden");
        dom(".lap").addClass("hidden");
    });

    dom(".reset").on("click", function(){
        eval("stopwatch"+_pid+".reset();");
        // ボタン入れ替え
        dom(".stop").addClass("hidden");
        dom(".start").removeClass("hidden");
        dom(".laps").addClass("hidden");
        dom(".lap").addClass("hidden");
    });

    dom(".lap").on("click", function(){
        eval("stopwatch"+_pid+".addLap();");
    });

}
eval("var stopwatch"+pid+";");
useStopWatch(pid);