class Engine {

    _speed = 0;

    
    get speed() {
        return this._speed;
    }

    set speed(value) {
        
        if (value < 0) {
            throw new Error('Speed must be a positive number.');
        }

        this._speed = value;
    }

}