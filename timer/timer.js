if (typeof timers === "undefined") timers = new Array();
if (typeof timer_interval_ids === "undefined") timer_interval_ids = new Object();

System.avoidMultiple(pid);

((_pid) => {

    $("#w" + _pid).resizable({
        alsoResize: "#w" + _pid + " .timer",
        minWidth: "300",
        minHeight: "150"
    });

    this_timer_idx = timers.length;

    const dom = (attribute) => {
        return $("#winc" + _pid + " " + attribute);
    }

    const ONE_SEC_IN_MS = 1000;

    class Timer{
        constructor(value,show_obj, _pid_) {
            const time = value.split(":");
            this.sec = parseInt(time[0]) * 3600 +
                        parseInt(time[1]) * 60 +
                        parseInt(time[2]);
            if(isNaN(this.sec)) this.sec = 0;
            //console.log("初期の秒数："+this.sec);
            this.show_obj = dom(show_obj);
            this.pid = _pid_;
        }

        updateTime() {
            const HOUR = (this.sec - this.sec % 3600) / 3600 || 0;
            const MINUTE = ((this.sec - HOUR * 3600) - (this.sec - HOUR * 3600) % 60) / 60 || 0;
            const SEC = this.sec - MINUTE * 60 + HOUR * 3600 || 0;
            this.show_obj.text(('000' + HOUR).slice(-2) + " : " + ('000' + MINUTE).slice(-2) + " : " + ('000' + SEC).slice(-2));
        }

        changeTimeVal(n) {
            const sec = parseInt(time[0]) * 3600 +
                        parseInt(time[1]) * 60 +
                        parseInt(time[2]);
            if(sec + n > 0) this.sec += n;
            const SEC = this.sec % 60 | 0;
            const MINUTE = this.sec > 60 ? (this.sec - SEC) / 60 : 0;
            const HOUR = this.sec > 3600 ? (this.sec - MINUTE * 60) / 3600 : 0;
            dom(".timer .time_input").val(('000' + HOUR).slice(-2) + " : " + ('000' + MINUTE).slice(-2) + " : " + ('000' + SEC).slice(-2));
        }

        countDownAndNotice() {
            if (isNaN(this.sec)||this.sec <= -1) this.sec = 0;
            this.sec--;
            this.updateTime();
            console.log(this);
            if(this.sec <= 0 || dom(".time_input").val() === "00:00:00") {
                this.stop();
                System.alert("タイマー終了です。");
                Notification.push("タイマー", "タイマー終了", "timer");
                dom(".timer_show").addClass("hidden");
                dom(".timer_set").removeClass("hidden");
                timers[this_timer_idx] = null;
            }
            console.log(this);
        }

        start() {
            this.updateTime();
            this.countDown = setInterval("timers["+ this_timer_idx +"].countDownAndNotice()", ONE_SEC_IN_MS);
            if (typeof timer_interval_ids[this.pid] === "undefined") timer_interval_ids[this.pid] = new Array();
            timer_interval_ids[this.pid].push(this.countDown);
        }

        stop() {
            //clearInterval(this.countDown);
            console.log(timer_interval_ids);
            timer_interval_ids[this.pid].forEach(i => clearInterval(i));
        }
    }

    dom(".set").on("click", function(){
        //console.log("ボタン押されたよ");
            dom(".timer_set").addClass("hidden");
            dom(".timer_show").removeClass("hidden");
            timers[this_timer_idx] = new Timer(dom(".time_input").val(), ".timer .time", _pid);
            timers[this_timer_idx].start();
            dom(".continue").addClass("hidden");
            dom(".stop").removeClass("hidden");
    });

    dom(".set").on("keydown keyup keypress change",function(){
        
    });

    dom(".reset").on("click", function(){
        dom(".timer_show").addClass("hidden");
        dom(".timer_set").removeClass("hidden");
        timers[this_timer_idx].stop();
        timers[this_timer_idx] = null;
    });

    dom(".continue").on("click", function(){
        dom(".continue").addClass("hidden");
        dom(".stop").removeClass("hidden");
        timers[this_timer_idx].start();
    });

    dom(".stop").on("click", function(){
        dom(".stop").addClass("hidden");
        dom(".continue").removeClass("hidden");
        timers[this_timer_idx].stop();
    });
})(pid);