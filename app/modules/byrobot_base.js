const _ = require('lodash');
const BaseModule = require('./baseModule');


/***************************************************************************************
 *  기본 클래스
 ***************************************************************************************/

class byrobot_base extends BaseModule
{

    /***************************************************************************************
     *  클래스 내부에서 사용될 필드들을 이곳에서 선언합니다.
     ***************************************************************************************/
    // #region Constructor

    constructor()
    {
        super();

        createCRC16Array();

        this.serialport = null;
        this.isConnect = false;


        /***************************************************************************************
         *  드론, 조종기에 전달하는 명령
         ***************************************************************************************/

        /*
            대상 장치로부터 수신 받는 데이터는 모두 _updated 변수를 최상단에 붙임.
            업데이트 된 경우 _updated를 1로 만들고 entry로 전송이 끝나면 다시 0으로 변경
        */
        
        // Entry -> Device
        this.DataType =
        {
            // 전송 버퍼
            BUFFER_CLEAR                : 'buffer_clear',
        
            // 전송 대상
            TARGET                      : 'target',

            // Light Manaul
            LIGHT_MANUAL_FLAGS          : 'light_manual_flags',
            LIGHT_MANUAL_BRIGHTNESS     : 'light_manual_brightness',

            // Light Mode
            LIGHT_MODE_MODE             : 'light_mode_mode',
            LIGHT_MODE_INTERVAL         : 'light_mode_interval',

            // Light Event
            LIGHT_EVENT_EVENT           : 'light_event_event',
            LIGHT_EVENT_INTERVAL        : 'light_event_interval',
            LIGHT_EVENT_REPEAT          : 'light_event_repeat',

            // Light Color
            LIGHT_COLOR_R               : 'light_color_r',
            LIGHT_COLOR_G               : 'light_color_g',
            LIGHT_COLOR_B               : 'light_color_b',

            // 화면 전체 지우기
            DISPLAY_CLEAR_ALL_PIXEL     : 'display_clear_all_pixel',

            // 선택 영역 지우기
            DISPLAY_CLEAR_X             : 'display_clear_x',
            DISPLAY_CLEAR_Y             : 'display_clear_y',
            DISPLAY_CLEAR_WIDTH         : 'display_clear_width',
            DISPLAY_CLEAR_HEIGHT        : 'display_clear_height',
            DISPLAY_CLEAR_PIXEL         : 'display_clear_pixel',

            // 선택 영역 반전
            DISPLAY_INVERT_X            : 'display_invert_x',
            DISPLAY_INVERT_Y            : 'display_invert_y',
            DISPLAY_INVERT_WIDTH        : 'display_invert_width',
            DISPLAY_INVERT_HEIGHT       : 'display_invert_height',

            // 화면에 점 찍기
            DISPLAY_DRAW_POINT_X        : 'display_draw_point_x',
            DISPLAY_DRAW_POINT_Y        : 'display_draw_point_y',
            DISPLAY_DRAW_POINT_PIXEL    : 'display_draw_point_pixel',

            // 화면에 선 그리기
            DISPLAY_DRAW_LINE_X1        : 'display_draw_line_x1',
            DISPLAY_DRAW_LINE_Y1        : 'display_draw_line_y1',
            DISPLAY_DRAW_LINE_X2        : 'display_draw_line_x2',
            DISPLAY_DRAW_LINE_Y2        : 'display_draw_line_y2',
            DISPLAY_DRAW_LINE_PIXEL     : 'display_draw_line_pixel',
            DISPLAY_DRAW_LINE_LINE      : 'display_draw_line_line',

            // 화면에 사각형 그리기
            DISPLAY_DRAW_RECT_X         : 'display_draw_rect_x',
            DISPLAY_DRAW_RECT_Y         : 'display_draw_rect_y',
            DISPLAY_DRAW_RECT_WIDTH     : 'display_draw_rect_width',
            DISPLAY_DRAW_RECT_HEIGHT    : 'display_draw_rect_height',
            DISPLAY_DRAW_RECT_PIXEL     : 'display_draw_rect_pixel',
            DISPLAY_DRAW_RECT_FLAGFILL  : 'display_draw_rect_flagfill',
            DISPLAY_DRAW_RECT_LINE      : 'display_draw_rect_line',

            // 화면에 원 그리기
            DISPLAY_DRAW_CIRCLE_X        : 'display_draw_circle_x',
            DISPLAY_DRAW_CIRCLE_Y        : 'display_draw_circle_y',
            DISPLAY_DRAW_CIRCLE_RADIUS   : 'display_draw_circle_radius',
            DISPLAY_DRAW_CIRCLE_PIXEL    : 'display_draw_circle_pixel',
            DISPLAY_DRAW_CIRCLE_FLAGFILL : 'display_draw_circle_flagfill',

            // 화면에 문자열 쓰기
            DISPLAY_DRAW_STRING_X       : 'display_draw_string_x',
            DISPLAY_DRAW_STRING_Y       : 'display_draw_string_y',
            DISPLAY_DRAW_STRING_FONT    : 'display_draw_string_font',
            DISPLAY_DRAW_STRING_PIXEL   : 'display_draw_string_pixel',
            DISPLAY_DRAW_STRING_STRING  : 'display_draw_string_string',

            // 화면에 문자열 정렬하여 그리기
            DISPLAY_DRAW_STRING_ALIGN_X_START   : 'display_draw_string_align_x_start',
            DISPLAY_DRAW_STRING_ALIGN_X_END     : 'display_draw_string_align_x_end',
            DISPLAY_DRAW_STRING_ALIGN_Y         : 'display_draw_string_align_y',
            DISPLAY_DRAW_STRING_ALIGN_ALIGN     : 'display_draw_string_align_align',
            DISPLAY_DRAW_STRING_ALIGN_FONT      : 'display_draw_string_align_font',
            DISPLAY_DRAW_STRING_ALIGN_PIXEL     : 'display_draw_string_align_pixel',
            DISPLAY_DRAW_STRING_ALIGN_STRING    : 'display_draw_string_align_string',

            // Buzzer
            BUZZER_MODE                 : 'buzzer_mode',
            BUZZER_VALUE                : 'buzzer_value',
            BUZZER_TIME                 : 'buzzer_time',

            // Vibrator
            VIBRATOR_MODE               : 'vibrator_mode',
            VIBRATOR_ON                 : 'vibrator_on',
            VIBRATOR_OFF                : 'vibrator_off',
            VIBRATOR_TOTAL              : 'vibrator_total',

            // Control::Quad8
            CONTROL_QUAD8_ROLL                   : 'control_quad8_roll',
            CONTROL_QUAD8_PITCH                  : 'control_quad8_pitch',
            CONTROL_QUAD8_YAW                    : 'control_quad8_yaw',
            CONTROL_QUAD8_THROTTLE               : 'control_quad8_throttle',
            
            // Control::Position
            CONTROL_POSITION_X                   : 'control_position_x',
            CONTROL_POSITION_Y                   : 'control_position_y',
            CONTROL_POSITION_Z                   : 'control_position_z',
            CONTROL_POSITION_VELOCITY            : 'control_position_velocity',
            CONTROL_POSITION_HEADING             : 'control_position_heading',
            CONTROL_POSITION_ROTATIONAL_VELOCITY : 'control_position_rotational_velocity',

            // Command
            COMMAND_COMMAND            : 'command_command',
            COMMAND_OPTION             : 'command_option',

            // Motor
            MOTORSINGLE_TARGET         : 'motorsingle_target',
            MOTORSINGLE_ROTATION       : 'motorsingle_rotation',     // direction -> rotation
            MOTORSINGLE_VALUE          : 'motorsingle_value',
        };
    

        // -- JSON Objects ----------------------------------------------------------------
        // Device -> Entry 

        // Ack
        this.ack =
        {
            _updated            : 1,
            ack_systemTime      : 0,    // u64
            ack_dataType        : 0,    // u8
            ack_crc16           : 0,    // u16
        };


        // Joystick
        this.joystick = 
        {
            _updated                    : 1,
            joystick_left_x             : 0,    // s8
            joystick_left_y             : 0,    // s8
            joystick_left_direction     : 0,    // u8
            joystick_left_event         : 0,    // u8
            joystick_right_x            : 0,    // s8
            joystick_right_y            : 0,    // s8
            joystick_right_direction    : 0,    // u8
            joystick_right_event        : 0,    // u8
        };


        // Button
        this.button = 
        {
            _updated        : 1,
            button_button   : 0,    // u16
            button_event    : 0,    // u8
        };


        // State
        this.state = 
        {
            _updated                : 1,
            state_modeSystem        : 0,    // u8
            state_modeFlight        : 0,    // u8
            state_modeControlFlight : 0,    // u8
            state_modeMovement      : 0,    // u8
            state_headless          : 0,    // u8
            state_sensorOrientation : 0,    // u8
            state_battery           : 0,    // u8
        };


        // Position
        this.position =
        {
            _updated    : 1,
            position_x  : 0,    // f32
            position_y  : 0,    // f32
            position_z  : 0,    // f32
        };


        // Altitude
        this.altitude =
        {
            _updated                : 1,
            altitude_temperature    : 0,    // f32
            altitude_pressure       : 0,    // f32
            altitude_altitude       : 0,    // f32
            altitude_rangeHeight    : 0,    // f32
        };


        // Motion
        this.motion =
        {
            _updated            : 1,
            motion_accX         : 0,    // s16
            motion_accY         : 0,    // s16
            motion_accZ         : 0,    // s16
            motion_gyroRoll     : 0,    // s16
            motion_gyroPitch    : 0,    // s16
            motion_gyroYaw      : 0,    // s16
            motion_angleRoll    : 0,    // s16
            motion_anglePitch   : 0,    // s16
            motion_angleYaw     : 0,    // s16
        };


        // Range
        this.range =
        {
            _updated        : 1,
            range_left      : 0,    // s16
            range_front     : 0,    // s16
            range_right     : 0,    // s16
            range_rear      : 0,    // s16
            range_top       : 0,    // s16
            range_bottom    : 0,    // s16
        };


        // InformationAssembledForEntry
        this.informationAssembledForEntry =
        {
            _updated        : 1,
            informationAssembledForEntry_angleRoll      : 0,    // s16
            informationAssembledForEntry_anglePitch     : 0,    // s16
            informationAssembledForEntry_angleYaw       : 0,    // s16
            informationAssembledForEntry_positionX      : 0,    // s16
            informationAssembledForEntry_positionY      : 0,    // s16
            informationAssembledForEntry_positionZ      : 0,    // s16
            informationAssembledForEntry_rangeHeight    : 0,    // s16
            informationAssembledForEntry_altitude       : 0,    // float
        };


        // -- Control -----------------------------------------------------------------
        this.controlWheel           = 0;        // 
        this.controlAccel           = 0;        // 
        this.controlRoll            = 0;        // 
        this.controlPitch           = 0;        // 
        this.controlYaw             = 0;        // 
        this.controlThrottle        = 0;        // 


        // -- Hardware ----------------------------------------------------------------
        this.bufferReceive          = [];       // 데이터 수신 버퍼
        this.bufferTransfer         = [];       // 데이터 송신 버퍼

        this.dataType               = 0;        // 수신 받은 데이터의 타입
        this.dataLength             = 0;        // 수신 받은 데이터의 길이
        this.from                   = 0;        // 송신 장치 타입
        this.to                     = 0;        // 수신 장치 타입
        this.indexSession           = 0;        // 수신 받는 데이터의 세션
        this.indexReceiver          = 0;        // 수신 받는 데이터의 세션 내 위치
        this.dataBlock              = [];       // 수신 받은 데이터 블럭
        this.crc16Calculated        = 0;        // CRC16 계산 된 결과
        this.crc16Received          = 0;        // CRC16 수신 받은 블럭
        this.crc16Transfered        = 0;        // 전송한 데이터의 crc16
        
        this.maxTransferRepeat      = 3;        // 최대 반복 전송 횟수
        this.countTransferRepeat    = 0;        // 반복 전송 횟수
        this.dataTypeLastTransfered = 0;        // 마지막으로 전송한 데이터의 타입

        this.timeReceive            = 0;        // 데이터를 전송 받은 시각
        this.timeTransfer           = 0;        // 예약 데이터를 전송한 시각
        this.timeTransferNext       = 0;        // 전송 가능한 다음 시간
        this.timeTransferInterval   = 20;       // 최소 전송 시간 간격

        this.countReqeustDevice     = 0;        // 장치에 데이터를 요청한 횟수 카운트

        this.targetDevice           = 0;            // 연결 대상 장치 DeviceType
        this.targetDeviceID         = undefined;    // 연결 대상 장치의 ID
    }

    // #endregion Constructor



    /***************************************************************************************
     *  Entry 기본 함수
     ***************************************************************************************/
    // #region Base Functions for Entry

    /*
        초기설정

        최초에 커넥션이 이루어진 후의 초기 설정.
        handler 는 워크스페이스와 통신하 데이터를 json 화 하는 오브젝트입니다. (datahandler/json 참고)
        config 은 module.json 오브젝트입니다.
    */
    init(handler, config)
    {
        super.init(handler, config);
        //this.resetData();
    }


    /*
        초기 송신데이터(필수)

        연결 후 초기에 송신할 데이터가 필요한 경우 사용합니다.
        requestInitialData 를 사용한 경우 checkInitialData 가 필수입니다.
        이 두 함수가 정의되어있어야 로직이 동작합니다. 필요없으면 작성하지 않아도 됩니다.
    */
    requestInitialData(serialport)
    {
        if (!this.serialport)
        {
            this.isConnect = true;
            this.serialport = serialport;
        }

        return this.ping(this.targetDevice);
    }


    /*
        초기 수신데이터 체크(필수)
        연결 후 초기에 수신받아서 정상연결인지를 확인해야하는 경우 사용합니다.
     */
    checkInitialData(data, config)
    {
        return this.checkAck(data, config); 
    }


    /*
        주기적으로 하드웨어에서 받은 데이터의 검증이 필요한 경우 사용합니다.
    */
    validateLocalData(data)
    {
        return true;
    }


    /*
        하드웨어에 전달할 데이터
        
        하드웨어 기기에 전달할 데이터를 반환합니다.
        slave 모드인 경우 duration 속성 간격으로 지속적으로 기기에 요청을 보냅니다.
    */
    requestLocalData()
    {
        return this.transferForDevice();
    }


    /*
        하드웨어에서 온 데이터 처리
    */
    handleLocalData(data)
    {
        this.receiverForDevice(data);
    }


    /*
        엔트리로 전달할 데이터
    */
    requestRemoteData(handler)
    {
        this.transferToEntry(handler);
    }


    /*
        엔트리에서 받은 데이터에 대한 처리
    */
    handleRemoteData(handler)
    {
        this.handlerForEntry(handler);
    }


    connect() {}


    disconnect(connect)
    {
        if (this.isConnect)
        {
            this.isConnect = false;
            connect.close();
        }
    }


    /*
        Web Socket 종료후 처리
    */
    reset()
    {
        this.log("reset", "");
        this.resetData();
    }

    
    // #endregion Base Functions for Entry



    /***************************************************************************************
     *  초기화
     ***************************************************************************************/
    // #region Data Reset

    resetData()
    {
        // -- JSON Objects ----------------------------------------------------------------
        // Device -> Entry 

        // Ack
        let ack                             = this.ack;
        ack._updated                        = 0;
        ack.ack_systemTime                  = 0;
        ack.ack_dataType                    = 0;
        ack.ack_crc16                       = 0;
        
        // Joystick
        let joystick                        = this.joystick; 
        joystick._updated                   = 0;
        joystick.joystick_left_x            = 0;
        joystick.joystick_left_y            = 0;
        joystick.joystick_left_direction    = 0;
        joystick.joystick_left_event        = 0;
        joystick.joystick_right_x           = 0;
        joystick.joystick_right_y           = 0;
        joystick.joystick_right_direction   = 0;
        joystick.joystick_right_event       = 0;

        // Button
        let button                          = this.button;
        button._updated                     = 0;
        button.button_button                = 0;
        button.button_event                 = 0;

        // State
        let state                           = this.state;
        state._updated                      = 0;
        state.state_modeSystem              = 0;
        state.state_modeFlight              = 0;
        state.state_modeControlFlight       = 0;
        state.state_modeMovement            = 0;
        state.state_headless                = 0;
        state.state_sensorOrientation       = 0;
        state.state_battery                 = 0;

        // Position
        let position                        = this.position;
        position._updated                   = 0;
        position.position_x                 = 0;
        position.position_y                 = 0;
        position.position_z                 = 0;

        // Altitude
        let altitude                        = this.altitude;
        altitude._updated                   = 0;
        altitude.altitude_temperature       = 0;
        altitude.altitude_pressure          = 0;
        altitude.altitude_altitude          = 0;
        altitude.altitude_rangeHeight       = 0;

        // Motion
        let motion                          = this.motion;
        motion._updated                     = 0;
        motion.motion_accX                  = 0;
        motion.motion_accY                  = 0;
        motion.motion_accZ                  = 0;
        motion.motion_gyroRoll              = 0;
        motion.motion_gyroPitch             = 0;
        motion.motion_gyroYaw               = 0;
        motion.motion_angleRoll             = 0;
        motion.motion_anglePitch            = 0;
        motion.motion_angleYaw              = 0;

        // Range
        let range                           = this.range;
        range._updated                      = 0;
        range.range_left                    = 0;
        range.range_front                   = 0;
        range.range_right                   = 0;
        range.range_rear                    = 0;
        range.range_top                     = 0;
        range.range_bottom                  = 0;

        // Range
        let informationAssembledForEntry                                        = this.informationAssembledForEntry;
        informationAssembledForEntry.informationAssembledForEntry_angleRoll     = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_anglePitch    = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_angleYaw      = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_positionX     = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_positionY     = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_positionZ     = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_rangeHeight   = 0;    // s16
        informationAssembledForEntry.informationAssembledForEntry_altitude      = 0;    // float

        // -- Control -----------------------------------------------------------------
        this.controlRoll                    = 0;        // 
        this.controlPitch                   = 0;        // 
        this.controlYaw                     = 0;        // 
        this.controlThrottle                = 0;        // 

        // -- Hardware ----------------------------------------------------------------
        this.bufferReceive                  = [];       // 데이터 수신 버퍼
        this.bufferTransfer                 = [];       // 데이터 송신 버퍼

        this.dataType                       = 0;        // 수신 받은 데이터의 타입
        this.dataLength                     = 0;        // 수신 받은 데이터의 길이
        this.from                           = 0;        // 송신 장치 타입
        this.to                             = 0;        // 수신 장치 타입
        this.indexSession                   = 0;        // 수신 받은 데이터의 세션
        this.indexReceiver                  = 0;        // 수신 받은 데이터의 세션 내 위치
        this.dataBlock                      = [];       // 수신 받은 데이터 블럭
        this.crc16Calculated                = 0;        // CRC16 계산 된 결과
        this.crc16Received                  = 0;        // CRC16 수신 받은 블럭

        this.maxTransferRepeat              = 3;        // 최대 반복 전송 횟수
        this.countTransferRepeat            = 0;        // 반복 전송 횟수
        this.dataTypeLastTransfered         = 0;        // 마지막으로 전송한 데이터의 타입

        this.timeReceive                    = 0;        // 데이터를 전송 받은 시각
        this.timeTransfer                   = 0;        // 예약 데이터를 전송한 시각
        this.timeTransferNext               = 0;        // 전송 가능한 다음 시간
        this.timeTransferInterval           = 20;       // 최소 전송 시간 간격

        this.countReqeustDevice             = 0;        // 장치에 데이터를 요청한 횟수 카운트 
    }
    // #endregion Data Reset



    /***************************************************************************************
     *  Communciation - 초기 연결 시 장치 확인
     ***************************************************************************************/
    // #region check Ack for first connection

    checkAck(data, config)
    {
        this.receiverForDevice(data);

        if( this.targetDeviceID == undefined )
        {
            return false;
        }

        let ack = this.ack;
        if( ack._updated == true )
        {
            config.id = this.targetDeviceID;
            return true;
        }

        return false;
    }
    // #endregion check Ack for first connection



    /***************************************************************************************
     *  Communciation - Entry로부터 받은 데이터를 장치에 전송
     ***************************************************************************************/
    // #region Data Transfer to Device from Entry

    /*
        Entry에서 받은 데이터 블럭 처리
        Entry에서 수신 받은 데이터는 bufferTransfer에 바로 등록

        * entryjs에서 변수값을 entry-hw로 전송할 때 절차

            1. Entry.hw.setDigitalPortValue("", value) 명령을 사용하여 지정한 변수의 값을 등록
            2. Entry.hw.update() 를 사용하여 등록된 값 전체 전달
            3. delete Entry.hw.sendQueue[""] 를 사용하여 전달한 값을 삭제

            위와 같은 절차로 데이터를 전송해야 1회만 전송 됨.
            Entry.hw.update를 호출하면 등록된 값 전체를 한 번에 즉시 전송하는 것으로 보임
    */
    handlerForEntry(handler)
    {
        if( this.bufferTransfer == undefined )
        {
            this.bufferTransfer = [];
        }

        // Buffer Clear
        if( handler.e(this.DataType.BUFFER_CLEAR) == true )
        {
            this.bufferTransfer = [];
        }


        // Light Manual
        if( (handler.e(this.DataType.LIGHT_MANUAL_FLAGS)        == true) &&
            (handler.e(this.DataType.LIGHT_MANUAL_BRIGHTNESS)   == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                  = handler.e(this.DataType.TARGET)                    ? handler.read(this.DataType.TARGET)                     : 0xFF;
            let lightManual_flags       = handler.e(this.DataType.LIGHT_MANUAL_FLAGS)        ? handler.read(this.DataType.LIGHT_MANUAL_FLAGS)         : 0;
            let lightManual_brightness  = handler.e(this.DataType.LIGHT_MANUAL_BRIGHTNESS)   ? handler.read(this.DataType.LIGHT_MANUAL_BRIGHTNESS)    : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 3;                     // 데이터의 길이

            // Header
            dataArray.push(0x20);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(lightManual_flags));
            dataArray.push(this.getByte1(lightManual_flags));
            dataArray.push(lightManual_brightness);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / LightManual", dataArray);
        }


        // LightModeColor
        if( (handler.e(this.DataType.LIGHT_MODE_MODE)       == true) &&
            (handler.e(this.DataType.LIGHT_MODE_INTERVAL)   == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_R)         == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_G)         == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_B)         == true) )
        {
            let dataArray = [];
    
            // Start Code
            this.addStartCode(dataArray);
            
            let target              = handler.e(this.DataType.TARGET)                ? handler.read(this.DataType.TARGET)               : 0xFF;
            let lightMode_mode      = handler.e(this.DataType.LIGHT_MODE_MODE)       ? handler.read(this.DataType.LIGHT_MODE_MODE)      : 0;
            let lightMode_interval  = handler.e(this.DataType.LIGHT_MODE_INTERVAL)   ? handler.read(this.DataType.LIGHT_MODE_INTERVAL)  : 0;
            let lightColor_r        = handler.e(this.DataType.LIGHT_COLOR_R)         ? handler.read(this.DataType.LIGHT_COLOR_R)        : 0;
            let lightColor_g        = handler.e(this.DataType.LIGHT_COLOR_G)         ? handler.read(this.DataType.LIGHT_COLOR_G)        : 0;
            let lightColor_b        = handler.e(this.DataType.LIGHT_COLOR_B)         ? handler.read(this.DataType.LIGHT_COLOR_B)        : 0;
            
            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 6;                     // 데이터의 길이
    
            // Header
            dataArray.push(0x21);                   // Data Type(LightModeColor)
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To
    
            // Data
            dataArray.push(lightMode_mode);
            dataArray.push(this.getByte0(lightMode_interval));
            dataArray.push(this.getByte1(lightMode_interval));
            dataArray.push(lightColor_r);
            dataArray.push(lightColor_g);
            dataArray.push(lightColor_b);
    
            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);
    
            // this.log("Light Mode");
    
            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / LightModeColor", dataArray);
        }
        // LightMode
        else if((handler.e(this.DataType.LIGHT_MODE_MODE)       == true) &&
                (handler.e(this.DataType.LIGHT_MODE_INTERVAL)   == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                  = handler.e(this.DataType.TARGET)                    ? handler.read(this.DataType.TARGET)                 : 0xFF;
            let lightMode_mode          = handler.e(this.DataType.LIGHT_MODE_MODE)           ? handler.read(this.DataType.LIGHT_MODE_MODE)        : 0;
            let lightMode_interval      = handler.e(this.DataType.LIGHT_MODE_INTERVAL)       ? handler.read(this.DataType.LIGHT_MODE_INTERVAL)    : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 3;                     // 데이터의 길이

            // Header
            dataArray.push(0x21);                   // Data Type(LightMode)
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(lightMode_mode);
            dataArray.push(this.getByte0(lightMode_interval));
            dataArray.push(this.getByte1(lightMode_interval));

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / LightMode", dataArray);
        }
        

        // LightEventColor
        if( (handler.e(this.DataType.LIGHT_EVENT_EVENT)     == true) &&
            (handler.e(this.DataType.LIGHT_EVENT_INTERVAL)  == true) &&
            (handler.e(this.DataType.LIGHT_EVENT_REPEAT)    == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_R)         == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_G)         == true) &&
            (handler.e(this.DataType.LIGHT_COLOR_B)         == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target              = handler.e(this.DataType.TARGET)                ? handler.read(this.DataType.TARGET)               : 0xFF;
            let lightEvent_event    = handler.e(this.DataType.LIGHT_EVENT_EVENT)     ? handler.read(this.DataType.LIGHT_EVENT_EVENT)    : 0;
            let lightEvent_interval = handler.e(this.DataType.LIGHT_EVENT_INTERVAL)  ? handler.read(this.DataType.LIGHT_EVENT_INTERVAL) : 0;
            let lightEvent_repeat   = handler.e(this.DataType.LIGHT_EVENT_REPEAT)    ? handler.read(this.DataType.LIGHT_EVENT_REPEAT)   : 0;
            let lightColor_r        = handler.e(this.DataType.LIGHT_COLOR_R)         ? handler.read(this.DataType.LIGHT_COLOR_R)        : 0;
            let lightColor_g        = handler.e(this.DataType.LIGHT_COLOR_G)         ? handler.read(this.DataType.LIGHT_COLOR_G)        : 0;
            let lightColor_b        = handler.e(this.DataType.LIGHT_COLOR_B)         ? handler.read(this.DataType.LIGHT_COLOR_B)        : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 7;                     // 데이터의 길이

            // Header
            dataArray.push(0x22);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.push(lightEvent_event);
            dataArray.push(this.getByte0(lightMode_interval));
            dataArray.push(this.getByte1(lightMode_interval));
            dataArray.push(lightEvent_repeat);
            dataArray.push(lightColor_r);
            dataArray.push(lightColor_g);
            dataArray.push(lightColor_b);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / LightEventColor", dataArray);
        }
        // LightEvent
        else if((handler.e(this.DataType.LIGHT_EVENT_EVENT)     == true) &&
                (handler.e(this.DataType.LIGHT_EVENT_INTERVAL)  == true) &&
                (handler.e(this.DataType.LIGHT_EVENT_REPEAT)    == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target              = handler.e(this.DataType.TARGET)                ? handler.read(this.DataType.TARGET)               : 0xFF;
            let lightEvent_event    = handler.e(this.DataType.LIGHT_EVENT_EVENT)     ? handler.read(this.DataType.LIGHT_EVENT_EVENT)    : 0;
            let lightEvent_interval = handler.e(this.DataType.LIGHT_EVENT_INTERVAL)  ? handler.read(this.DataType.LIGHT_EVENT_INTERVAL) : 0;
            let lightEvent_repeat   = handler.e(this.DataType.LIGHT_EVENT_REPEAT)    ? handler.read(this.DataType.LIGHT_EVENT_REPEAT)   : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 4;                     // 데이터의 길이

            // Header
            dataArray.push(0x22);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.push(lightEvent_event);
            dataArray.push(this.getByte0(lightMode_interval));
            dataArray.push(this.getByte1(lightMode_interval));
            dataArray.push(lightEvent_repeat);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / LightEvent", dataArray);
        }


        // 화면 전체 지우기
        if( handler.e(this.DataType.DISPLAY_CLEAR_ALL_PIXEL) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                   = handler.e(this.DataType.TARGET)                    ? handler.read(this.DataType.TARGET)                     : 0xFF;
            let display_clear_all_pixel  = handler.e(this.DataType.DISPLAY_CLEAR_ALL_PIXEL)   ? handler.read(this.DataType.DISPLAY_CLEAR_ALL_PIXEL)    : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 1;                     // 데이터의 길이

            // Header
            dataArray.push(0x80);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(display_clear_all_pixel);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayClearAll", dataArray);
        }


        // 선택 영역 지우기
        if( (handler.e(this.DataType.DISPLAY_CLEAR_WIDTH)   == true) ||
            (handler.e(this.DataType.DISPLAY_CLEAR_HEIGHT)  == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                  = handler.e(this.DataType.TARGET)               ? handler.read(this.DataType.TARGET)               : 0xFF;
            let display_clear_x         = handler.e(this.DataType.DISPLAY_CLEAR_X)      ? handler.read(this.DataType.DISPLAY_CLEAR_X)      : 0;
            let display_clear_y         = handler.e(this.DataType.DISPLAY_CLEAR_Y)      ? handler.read(this.DataType.DISPLAY_CLEAR_Y)      : 0;
            let display_clear_width     = handler.e(this.DataType.DISPLAY_CLEAR_WIDTH)  ? handler.read(this.DataType.DISPLAY_CLEAR_WIDTH)  : 0;
            let display_clear_height    = handler.e(this.DataType.DISPLAY_CLEAR_HEIGHT) ? handler.read(this.DataType.DISPLAY_CLEAR_HEIGHT) : 0;
            let display_clear_pixel     = handler.e(this.DataType.DISPLAY_CLEAR_PIXEL)  ? handler.read(this.DataType.DISPLAY_CLEAR_PIXEL)  : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 9;                     // 데이터의 길이

            // Header
            dataArray.push(0x80);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_clear_x));
            dataArray.push(this.getByte1(display_clear_x));
            dataArray.push(this.getByte0(display_clear_y));
            dataArray.push(this.getByte1(display_clear_y));
            dataArray.push(this.getByte0(display_clear_width));
            dataArray.push(this.getByte1(display_clear_width));
            dataArray.push(this.getByte0(display_clear_height));
            dataArray.push(this.getByte1(display_clear_height));
            dataArray.push(display_clear_pixel);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayClear", dataArray);
        }


        // 선택 영역 반전
        if( (handler.e(this.DataType.DISPLAY_INVERT_WIDTH)  == true) ||
            (handler.e(this.DataType.DISPLAY_INVERT_HEIGHT) == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                  = handler.e(this.DataType.TARGET)                   ? handler.read(this.DataType.TARGET)                : 0xFF;
            let display_invert_x        = handler.e(this.DataType.DISPLAY_INVERT_X)         ? handler.read(this.DataType.DISPLAY_INVERT_X)      : 0;
            let display_invert_y        = handler.e(this.DataType.DISPLAY_INVERT_Y)         ? handler.read(this.DataType.DISPLAY_INVERT_Y)      : 0;
            let display_invert_width    = handler.e(this.DataType.DISPLAY_INVERT_WIDTH)     ? handler.read(this.DataType.DISPLAY_INVERT_WIDTH)  : 0;
            let display_invert_height   = handler.e(this.DataType.DISPLAY_INVERT_HEIGHT)    ? handler.read(this.DataType.DISPLAY_INVERT_HEIGHT) : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 8;                     // 데이터의 길이

            // Header
            dataArray.push(0x81);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_invert_x));
            dataArray.push(this.getByte1(display_invert_x));
            dataArray.push(this.getByte0(display_invert_y));
            dataArray.push(this.getByte1(display_invert_y));
            dataArray.push(this.getByte0(display_invert_width));
            dataArray.push(this.getByte1(display_invert_width));
            dataArray.push(this.getByte0(display_invert_height));
            dataArray.push(this.getByte1(display_invert_height));

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayInvert", dataArray);
        }


        // 화면에 점 찍기
        if( (handler.e(this.DataType.DISPLAY_DRAW_POINT_X)      == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_POINT_Y)      == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_POINT_PIXEL)  == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                      = handler.e(this.DataType.TARGET)                   ? handler.read(this.DataType.TARGET)                    : 0xFF;
            let display_draw_point_x        = handler.e(this.DataType.DISPLAY_DRAW_POINT_X)     ? handler.read(this.DataType.DISPLAY_DRAW_POINT_X)      : 0;
            let display_draw_point_y        = handler.e(this.DataType.DISPLAY_DRAW_POINT_Y)     ? handler.read(this.DataType.DISPLAY_DRAW_POINT_Y)      : 0;
            let display_draw_point_pixel    = handler.e(this.DataType.DISPLAY_DRAW_POINT_PIXEL) ? handler.read(this.DataType.DISPLAY_DRAW_POINT_PIXEL)  : 0;
            
            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 5;                     // 데이터의 길이

            // Header
            dataArray.push(0x82);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_point_x));
            dataArray.push(this.getByte1(display_draw_point_x));
            dataArray.push(this.getByte0(display_draw_point_y));
            dataArray.push(this.getByte1(display_draw_point_y));
            dataArray.push(display_draw_point_pixel);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayDrawPoint", dataArray);
        }


        // 화면에 선 그리기
        if( (handler.e(this.DataType.DISPLAY_DRAW_LINE_X1) == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_LINE_Y1) == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_LINE_X2) == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_LINE_Y2) == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                      = handler.e(this.DataType.TARGET)                    ? handler.read(this.DataType.TARGET)                     : 0xFF;
            let display_draw_line_x1        = handler.e(this.DataType.DISPLAY_DRAW_LINE_X1)      ? handler.read(this.DataType.DISPLAY_DRAW_LINE_X1)       : 0;
            let display_draw_line_y1        = handler.e(this.DataType.DISPLAY_DRAW_LINE_Y1)      ? handler.read(this.DataType.DISPLAY_DRAW_LINE_Y1)       : 0;
            let display_draw_line_x2        = handler.e(this.DataType.DISPLAY_DRAW_LINE_X2)      ? handler.read(this.DataType.DISPLAY_DRAW_LINE_X2)       : 0;
            let display_draw_line_y2        = handler.e(this.DataType.DISPLAY_DRAW_LINE_Y2)      ? handler.read(this.DataType.DISPLAY_DRAW_LINE_Y2)       : 0;
            let display_draw_line_pixel     = handler.e(this.DataType.DISPLAY_DRAW_LINE_PIXEL)   ? handler.read(this.DataType.DISPLAY_DRAW_LINE_PIXEL)    : 0;
            let display_draw_line_line      = handler.e(this.DataType.DISPLAY_DRAW_LINE_LINE)    ? handler.read(this.DataType.DISPLAY_DRAW_LINE_LINE)     : 0;
            
            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 10;                     // 데이터의 길이

            // Header
            dataArray.push(0x83);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_line_x1));
            dataArray.push(this.getByte1(display_draw_line_x1));
            dataArray.push(this.getByte0(display_draw_line_y1));
            dataArray.push(this.getByte1(display_draw_line_y1));
            dataArray.push(this.getByte0(display_draw_line_x2));
            dataArray.push(this.getByte1(display_draw_line_x2));
            dataArray.push(this.getByte0(display_draw_line_y2));
            dataArray.push(this.getByte1(display_draw_line_y2));
            dataArray.push(display_draw_line_pixel);
            dataArray.push(display_draw_line_line);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayDrawLine", dataArray);
        }

        
        // 화면에 사각형 그리기
        if( (handler.e(this.DataType.DISPLAY_DRAW_RECT_WIDTH)   == true) ||
            (handler.e(this.DataType.DISPLAY_DRAW_RECT_HEIGHT)  == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                      = handler.e(this.DataType.TARGET)                        ? handler.read(this.DataType.TARGET)                         : 0xFF;
            let display_draw_rect_x         = handler.e(this.DataType.DISPLAY_DRAW_RECT_X)           ? handler.read(this.DataType.DISPLAY_DRAW_RECT_X)            : 0;
            let display_draw_rect_y         = handler.e(this.DataType.DISPLAY_DRAW_RECT_Y)           ? handler.read(this.DataType.DISPLAY_DRAW_RECT_Y)            : 0;
            let display_draw_rect_width     = handler.e(this.DataType.DISPLAY_DRAW_RECT_WIDTH)       ? handler.read(this.DataType.DISPLAY_DRAW_RECT_WIDTH)        : 0;
            let display_draw_rect_height    = handler.e(this.DataType.DISPLAY_DRAW_RECT_HEIGHT)      ? handler.read(this.DataType.DISPLAY_DRAW_RECT_HEIGHT)       : 0;
            let display_draw_rect_pixel     = handler.e(this.DataType.DISPLAY_DRAW_RECT_PIXEL)       ? handler.read(this.DataType.DISPLAY_DRAW_RECT_PIXEL)        : 0;
            let display_draw_rect_flagfill  = handler.e(this.DataType.DISPLAY_DRAW_RECT_FLAGFILL)    ? handler.read(this.DataType.DISPLAY_DRAW_RECT_FLAGFILL)     : 0;
            let display_draw_rect_line      = handler.e(this.DataType.DISPLAY_DRAW_RECT_LINE)        ? handler.read(this.DataType.DISPLAY_DRAW_RECT_LINE)         : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 11;                    // 데이터의 길이

            // Header
            dataArray.push(0x84);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_rect_x));
            dataArray.push(this.getByte1(display_draw_rect_x));
            dataArray.push(this.getByte0(display_draw_rect_y));
            dataArray.push(this.getByte1(display_draw_rect_y));
            dataArray.push(this.getByte0(display_draw_rect_width));
            dataArray.push(this.getByte1(display_draw_rect_width));
            dataArray.push(this.getByte0(display_draw_rect_height));
            dataArray.push(this.getByte1(display_draw_rect_height));
            dataArray.push(display_draw_rect_pixel);
            dataArray.push(display_draw_rect_flagfill);
            dataArray.push(display_draw_rect_line);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);

            this.log("Transfer_To_Device / DisplayDrawRect", dataArray);
        }


        // 화면에 원 그리기
        if( handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_RADIUS) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                       = handler.e(this.DataType.TARGET)                         ? handler.read(this.DataType.TARGET)                           : 0xFF;
            let display_draw_circle_x        = handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_X)          ? handler.read(this.DataType.DISPLAY_DRAW_CIRCLE_X)            : 0;
            let display_draw_circle_y        = handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_Y)          ? handler.read(this.DataType.DISPLAY_DRAW_CIRCLE_Y)            : 0;
            let display_draw_circle_radius   = handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_RADIUS)     ? handler.read(this.DataType.DISPLAY_DRAW_CIRCLE_RADIUS)       : 0;
            let display_draw_circle_pixel    = handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_PIXEL)      ? handler.read(this.DataType.DISPLAY_DRAW_CIRCLE_PIXEL)        : 0;
            let display_draw_circle_flagfill = handler.e(this.DataType.DISPLAY_DRAW_CIRCLE_FLAGFILL)   ? handler.read(this.DataType.DISPLAY_DRAW_CIRCLE_FLAGFILL)     : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 8;                     // 데이터의 길이

            // Header
            dataArray.push(0x85);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_circle_x));
            dataArray.push(this.getByte1(display_draw_circle_x));
            dataArray.push(this.getByte0(display_draw_circle_y));
            dataArray.push(this.getByte1(display_draw_circle_y));
            dataArray.push(this.getByte0(display_draw_circle_radius));
            dataArray.push(this.getByte1(display_draw_circle_radius));
            dataArray.push(display_draw_circle_pixel);
            dataArray.push(display_draw_circle_flagfill);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayDrawCircle", dataArray);
        }


        // 화면에 문자열 쓰기
        if( handler.e(this.DataType.DISPLAY_DRAW_STRING_STRING) == true )
        {
            let dataArray = [];
            let byteArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                       = handler.e(this.DataType.TARGET)                       ? handler.read(this.DataType.TARGET)                         : 0xFF;
            let display_draw_string_x        = handler.e(this.DataType.DISPLAY_DRAW_STRING_X)        ? handler.read(this.DataType.DISPLAY_DRAW_STRING_X)          : 0;
            let display_draw_string_y        = handler.e(this.DataType.DISPLAY_DRAW_STRING_Y)        ? handler.read(this.DataType.DISPLAY_DRAW_STRING_Y)          : 0;
            let display_draw_string_font     = handler.e(this.DataType.DISPLAY_DRAW_STRING_FONT)     ? handler.read(this.DataType.DISPLAY_DRAW_STRING_FONT)       : 0;
            let display_draw_string_pixel    = handler.e(this.DataType.DISPLAY_DRAW_STRING_PIXEL)    ? handler.read(this.DataType.DISPLAY_DRAW_STRING_PIXEL)      : 0;
            let display_draw_string_string   = handler.e(this.DataType.DISPLAY_DRAW_STRING_STRING)   ? handler.read(this.DataType.DISPLAY_DRAW_STRING_STRING)     : 0;

            byteArray = this.stringToAsciiByteArray(display_draw_string_string);

            let indexStart = dataArray.length;         // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 6 + byteArray.length;     // 데이터의 길이

            // Header
            dataArray.push(0x86);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_string_x));
            dataArray.push(this.getByte1(display_draw_string_x));
            dataArray.push(this.getByte0(display_draw_string_y));
            dataArray.push(this.getByte1(display_draw_string_y));
            dataArray.push(display_draw_string_font);
            dataArray.push(display_draw_string_pixel);

            for (let i = 0; i < byteArray.length; i++)
            {
                dataArray.push(byteArray[i]);
            }

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);

            this.log("Transfer_To_Device / DisplayDrawString", dataArray);
        }


        // 화면에 문자열 정렬하여 그리기
        if( handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_STRING) == true )
        {
            let dataArray = [];
            let byteArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                              = handler.e(this.DataType.TARGET)                                ? handler.read(this.DataType.TARGET)                             : 0xFF;
            let display_draw_string_align_x_start   = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_X_START)     ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_X_START)  : 0;
            let display_draw_string_align_x_end     = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_X_END)       ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_X_END)    : 0;
            let display_draw_string_align_y         = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_Y)           ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_Y)        : 0;
            let display_draw_string_align_align     = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_ALIGN)       ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_ALIGN)    : 0;
            let display_draw_string_align_font      = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_FONT)        ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_FONT)     : 0;
            let display_draw_string_align_pixel     = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_PIXEL)       ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_PIXEL)    : 0;
            let display_draw_string_align_string    = handler.e(this.DataType.DISPLAY_DRAW_STRING_ALIGN_STRING)      ? handler.read(this.DataType.DISPLAY_DRAW_STRING_ALIGN_STRING)   : 0;

            byteArray = this.stringToAsciiByteArray(display_draw_string_align_string);

            let indexStart = dataArray.length;         // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 9 + byteArray.length;     // 데이터의 길이

            // Header
            dataArray.push(0x87);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(this.getByte0(display_draw_string_align_x_start));
            dataArray.push(this.getByte1(display_draw_string_align_x_start));
            dataArray.push(this.getByte0(display_draw_string_align_x_end));
            dataArray.push(this.getByte1(display_draw_string_align_x_end));
            dataArray.push(this.getByte0(display_draw_string_align_y));
            dataArray.push(this.getByte1(display_draw_string_align_y));
            dataArray.push(display_draw_string_align_align);
            dataArray.push(display_draw_string_align_font);
            dataArray.push(display_draw_string_align_pixel);

            for (let i = 0; i < byteArray.length; i++)
            {
                dataArray.push(byteArray[i]);
            }

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / DisplayDrawStringAlign", dataArray);
        }


        // Command
        if( handler.e(this.DataType.COMMAND_COMMAND) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target          = handler.e(this.DataType.TARGET)           ? handler.read(this.DataType.TARGET)            : 0xFF;
            let command_command = handler.e(this.DataType.COMMAND_COMMAND)  ? handler.read(this.DataType.COMMAND_COMMAND)   : 0;
            let command_option  = handler.e(this.DataType.COMMAND_OPTION)   ? handler.read(this.DataType.COMMAND_OPTION)    : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 2;                     // 데이터의 길이

            // Header
            dataArray.push(0x11);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.push(command_command);
            dataArray.push(command_option);

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);

            switch( command_command )
            {
            case 0x01:  // CommandType::Stop
                {
                    // 정지 명령 시 조종 입력 값 초기화
                    this.controlRoll        = 0;
                    this.controlPitch       = 0;
                    this.controlYaw         = 0;
                    this.controlThrottle    = 0;
                }
                break;
            }

            this.log("Transfer_To_Device / Command" + command_command + ", option: " + command_option, dataArray);
        }


        // Control
        if( (handler.e(this.DataType.CONTROL_QUAD8_ROLL)      == true) ||
            (handler.e(this.DataType.CONTROL_QUAD8_PITCH)     == true) ||
            (handler.e(this.DataType.CONTROL_QUAD8_YAW)       == true) ||
            (handler.e(this.DataType.CONTROL_QUAD8_THROTTLE)  == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target          = handler.e(this.DataType.TARGET)                 ? handler.read(this.DataType.TARGET)                  : 0x10;
            let controlRoll     = handler.e(this.DataType.CONTROL_QUAD8_ROLL)     ? handler.read(this.DataType.CONTROL_QUAD8_ROLL)      : this.controlRoll;
            let controlPitch    = handler.e(this.DataType.CONTROL_QUAD8_PITCH)    ? handler.read(this.DataType.CONTROL_QUAD8_PITCH)     : this.controlPitch;
            let controlYaw      = handler.e(this.DataType.CONTROL_QUAD8_YAW)      ? handler.read(this.DataType.CONTROL_QUAD8_YAW)       : this.controlYaw;
            let controlThrottle = handler.e(this.DataType.CONTROL_QUAD8_THROTTLE) ? handler.read(this.DataType.CONTROL_QUAD8_THROTTLE)  : this.controlThrottle;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 4;                     // 데이터의 길이

            this.controlRoll        = controlRoll;
            this.controlPitch       = controlPitch;
            this.controlYaw         = controlYaw;
            this.controlThrottle    = controlThrottle;

            // Header
            dataArray.push(0x10);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.push(controlRoll);
            dataArray.push(controlPitch);
            dataArray.push(controlYaw);
            dataArray.push(controlThrottle);
    
            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            //this.log("handlerForEntry() / Control / roll: " + controlRoll + ", pitch: " + controlPitch + ", yaw: " + controlYaw + ", throttle: " + controlThrottle, dataArray);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / ControlQuad8", dataArray);
        }


        // Control
        if( (handler.e(this.DataType.CONTROL_POSITION_X)                    == true) ||
            (handler.e(this.DataType.CONTROL_POSITION_Y)                    == true) ||
            (handler.e(this.DataType.CONTROL_POSITION_Z)                    == true) ||
            (handler.e(this.DataType.CONTROL_POSITION_VELOCITY)             == true) ||
            (handler.e(this.DataType.CONTROL_POSITION_HEADING)              == true) ||
            (handler.e(this.DataType.CONTROL_POSITION_ROTATIONAL_VELOCITY)  == true) )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target                      = handler.e(this.DataType.TARGET)                               ? handler.read(this.DataType.TARGET)                                : 0x10;
            let controlPositionX            = handler.e(this.DataType.CONTROL_POSITION_X)                   ? handler.read(this.DataType.CONTROL_POSITION_X)           : 0;
            let controlPositionY            = handler.e(this.DataType.CONTROL_POSITION_Y)                   ? handler.read(this.DataType.CONTROL_POSITION_Y)           : 0;
            let controlPositionZ            = handler.e(this.DataType.CONTROL_POSITION_Z)                   ? handler.read(this.DataType.CONTROL_POSITION_Z)           : 0;
            let controlVelocity             = handler.e(this.DataType.CONTROL_POSITION_VELOCITY)            ? handler.read(this.DataType.CONTROL_POSITION_VELOCITY)             : 0;
            let controlHeading              = handler.e(this.DataType.CONTROL_POSITION_HEADING)             ? handler.read(this.DataType.CONTROL_POSITION_HEADING)              : 0;
            let controlRotationalvelocity   = handler.e(this.DataType.CONTROL_POSITION_ROTATIONAL_VELOCITY) ? handler.read(this.DataType.CONTROL_POSITION_ROTATIONAL_VELOCITY)  : 0;

            var floatArray = new Float32Array(4);
            floatArray[0] = controlPositionX;
            floatArray[1] = controlPositionY;
            floatArray[2] = controlPositionZ;
            floatArray[3] = controlVelocity;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 18;                     // 데이터의 길이

            // Header
            dataArray.push(0x10);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.concat(new Uint8Array(floatArray.buffer));
            dataArray.push(this.getByte0(controlHeading));
            dataArray.push(this.getByte1(controlHeading));
            dataArray.push(this.getByte0(controlRotationalvelocity));
            dataArray.push(this.getByte1(controlRotationalvelocity));
    
            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / ControlPosition", dataArray);
        }


        // MotorSingle
        if( handler.e(this.DataType.MOTORSINGLE_TARGET) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target              = handler.e(this.DataType.TARGET)               ? handler.read(this.DataType.TARGET)                : 0x10;
            let motorSingleTarget   = handler.e(this.DataType.MOTORSINGLE_TARGET)   ? handler.read(this.DataType.MOTORSINGLE_TARGET)    : 0;
            let motorSingleRotation = handler.e(this.DataType.MOTORSINGLE_ROTATION) ? handler.read(this.DataType.MOTORSINGLE_ROTATION)  : 0;
            let motorSingleValue    = handler.e(this.DataType.MOTORSINGLE_VALUE)    ? handler.read(this.DataType.MOTORSINGLE_VALUE)     : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 4;                     // 데이터의 길이

            // Header
            dataArray.push(0x61);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data Array
            dataArray.push(motorSingleTarget);
            dataArray.push(motorSingleRotation);
            dataArray.push(this.getByte0(motorSingleValue));
            dataArray.push(this.getByte1(motorSingleValue));

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);
            
            this.log("Transfer_To_Device / MotorSingle", dataArray);
        }


        // Buzzer
        if( handler.e(this.DataType.BUZZER_MODE) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target          = handler.e(this.DataType.TARGET)       ? handler.read(this.DataType.TARGET)        : 0x20;
            let buzzer_mode     = handler.e(this.DataType.BUZZER_MODE)  ? handler.read(this.DataType.BUZZER_MODE)   : 0;
            let buzzer_value    = handler.e(this.DataType.BUZZER_VALUE) ? handler.read(this.DataType.BUZZER_VALUE)  : 0;
            let buzzer_time     = handler.e(this.DataType.BUZZER_TIME)  ? handler.read(this.DataType.BUZZER_TIME)   : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 5;                     // 데이터의 길이

            // Header
            dataArray.push(0x62);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(buzzer_mode);
            dataArray.push(this.getByte0(buzzer_value));
            dataArray.push(this.getByte1(buzzer_value));
            dataArray.push(this.getByte0(buzzer_time));
            dataArray.push(this.getByte1(buzzer_time));

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);

            this.log("Transfer_To_Device / Buzzer / buzzer_mode: " + buzzer_mode + ", buzzer_value: " + buzzer_value + ", buzzer_time: " + buzzer_time, dataArray);
        }


        // Vibrator
        if( handler.e(this.DataType.VIBRATOR_ON) == true )
        {
            let dataArray = [];

            // Start Code
            this.addStartCode(dataArray);
            
            let target          = handler.e(this.DataType.TARGET)           ? handler.read(this.DataType.TARGET)            : 0x20;
            let vibrator_mode   = handler.e(this.DataType.VIBRATOR_MODE)    ? handler.read(this.DataType.VIBRATOR_MODE)     : 0;
            let vibrator_on     = handler.e(this.DataType.VIBRATOR_ON)      ? handler.read(this.DataType.VIBRATOR_ON)       : 0;
            let vibrator_off    = handler.e(this.DataType.VIBRATOR_OFF)     ? handler.read(this.DataType.VIBRATOR_OFF)      : 0;
            let vibrator_total  = handler.e(this.DataType.VIBRATOR_TOTAL)   ? handler.read(this.DataType.VIBRATOR_TOTAL)    : 0;

            let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
            let dataLength = 7;                     // 데이터의 길이

            // Header
            dataArray.push(0x63);                   // Data Type
            dataArray.push(dataLength);             // Data Length
            dataArray.push(0x82);                   // From (네이버 엔트리)
            dataArray.push(target);                 // To

            // Data
            dataArray.push(vibrator_mode);
            dataArray.push(this.getByte0(vibrator_on));
            dataArray.push(this.getByte1(vibrator_on));
            dataArray.push(this.getByte0(vibrator_off));
            dataArray.push(this.getByte1(vibrator_off));
            dataArray.push(this.getByte0(vibrator_total));
            dataArray.push(this.getByte1(vibrator_total));

            // CRC16
            this.addCRC16(dataArray, indexStart, dataLength);

            this.bufferTransfer.push(dataArray);

            this.log("Transfer_To_Device / Vibrator", dataArray);
        }

        //this.log("handlerForEntry()", dataArray);
    }


    // 시작 코드 추가
    addStartCode(dataArray)
    {
        if( dataArray == undefined )
        {
            dataArray = [];
        }

        // Start Code
        dataArray.push(0x0A);
        dataArray.push(0x55);
    }


    // CRC16을 계산해서 추가
    addCRC16(dataArray, indexStart, dataLength)
    {
        if( dataArray.length < indexStart + 4 + dataLength )
        {
            return;
        }
        
        // CRC16
        let crc16 = 0;
        let totalLength = 4 + dataLength;
        for(let i=0; i<totalLength; i++)
        {
            crc16 = this.calcCRC16(dataArray[indexStart + i], crc16);
        }
        dataArray.push((crc16 & 0xff));
        dataArray.push(((crc16 >> 8) & 0xff));
    }
    // #endregion Data Transfer to Device from Entry



    /***************************************************************************************
     *  Communciation - 장치로부터 받은 데이터를 Entry에 전송
     ***************************************************************************************/
    // #region Data Transfer to Entry from Device

    // Entry에 데이터 전송
    transferToEntry(handler)
    {
        // Joystick
        {
            let joystick = this.joystick;
            if( joystick._updated == true )
            {
                for(let key in joystick)
                {
                    handler.write(key, joystick[key]);
                }

                joystick._updated = false;
                //this.log("transferToEntry() / joystick", "");
            }
        }

        // Button
        {
            let button = this.button;
            if( button._updated == true )
            {
                for(let key in button)
                {
                    handler.write(key, button[key]);
                }

                button._updated = false;
                //this.log("transferToEntry() / button", "");
            }
        }

        // State
        {
            let state = this.state;
            if( state._updated == true )
            {
                for(let key in state)
                {
                    handler.write(key, state[key]);
                }

                state._updated = false;
                //this.log("transferToEntry() / state", "");
            }
        }
    
        // Position
        {
            let position = this.position;
            if( position._updated == true )
            {
                for(let key in position)
                {
                    handler.write(key, position[key]);
                }
    
                position._updated = false;
                //this.log("tansferForEntry() / position", "");
            }
        }
    
        // Altitude
        {
            let altitude = this.altitude;
            if( altitude._updated == true )
            {
                for(let key in altitude)
                {
                    handler.write(key, altitude[key]);
                }
    
                altitude._updated = false;
                //this.log("tansferForEntry() / Altitude", "");
            }
        }

        // Motion
        {
            let motion = this.motion;
            if( motion._updated == true )
            {
                for(let key in motion)
                {
                    handler.write(key, motion[key]);
                }

                motion._updated = false;
                //this.log("transferToEntry() / Motion", "");
            }
        }

        // Range
        {
            let range = this.range;
            if( range._updated == true )
            {
                for(let key in range)
                {
                    handler.write(key, range[key]);
                }

                range._updated = false;
                //this.log("transferToEntry() / range", "");
            }
        }
    
        // InformationAssembledForEntry
        {
            let informationAssembledForEntry = this.informationAssembledForEntry;
            if( informationAssembledForEntry._updated == true )
            {
                for(let key in informationAssembledForEntry)
                {
                    handler.write(key, informationAssembledForEntry[key]);
                }
    
                informationAssembledForEntry._updated = false;
                //this.log("tansferForEntry() / informationAssembledForEntry", "");
            }
        }

        // Entry-hw information
        {
            if( this.bufferTransfer == undefined )
            {
                this.bufferTransfer = [];
            }

            handler.write("entryhw_countTransferReserved", this.bufferTransfer.length);
        }
    }
    
    // #endregion Data Transfer to Entry from Device



    /***************************************************************************************
     *  Communciation - 장치로부터 받은 데이터를 검증
     ***************************************************************************************/
    // #region Data Receiver from Device

    // 장치로부터 받은 데이터 배열 처리
    receiverForDevice(data)
    {
        if( this.receiveBuffer == undefined )
        {
            this.receiveBuffer = [];
        }

        // 수신 받은 데이터를 버퍼에 추가
        for(let i=0; i<data.length; i++)
        {
            this.receiveBuffer.push(data[i]);
        }

        //this.log("receiverForDevice()", this.receiveBuffer);

        // 버퍼로부터 데이터를 읽어 하나의 완성된 데이터 블럭으로 변환
        while(this.receiveBuffer.length > 0)
        {
            let data            = this.receiveBuffer.shift();
            let flagContinue    = true;
            let flagSessionNext = false;
            let flagComplete    = false;
            
            switch(this.indexSession)
            {
            case 0:
                // Start Code
                {               
                    switch( this.indexReceiver )
                    {
                    case 0:
                        if( data != 0x0A )
                        {
                            continue;
                        }
                        break;
                    
                    case 1:
                        if( data != 0x55 )
                        {
                            flagContinue = false;
                        }
                        else
                        {
                            flagSessionNext = true;
                        }
                        break;
                    }
                }
                break;

            case 1:
                // Header
                {
                    switch( this.indexReceiver )
                    {
                    case 0:
                        {
                            this.dataType = data;
                            this.crc16Calculated = this.calcCRC16(data, 0);
                        }
                        break;
                    
                    case 1:
                        {
                            this.dataLength = data;
                            this.crc16Calculated = this.calcCRC16(data, this.crc16Calculated);
                        }
                        break;
                    
                    case 2:
                        {
                            this.from = data;
                            this.crc16Calculated = this.calcCRC16(data, this.crc16Calculated);
                        }
                        break;
                    
                    case 3:
                        {
                            this.to = data;
                            this.crc16Calculated = this.calcCRC16(data, this.crc16Calculated);
                            this.dataBlock = [];        // 수신 받은 데이터 블럭
                            if( this.dataLength == 0 )
                            {
                                this.indexSession++;    // 데이터의 길이가 0인 경우 바로 CRC16으로 넘어가게 함
                            }
                            flagSessionNext = true;
                        }
                        break;
                    }
                }
                break;

            case 2:
                // Data
                {
                    this.dataBlock.push(data);
                    this.crc16Calculated = this.calcCRC16(data, this.crc16Calculated);
                    
                    if( this.dataBlock.length == this.dataLength )
                    {
                        flagSessionNext = true;
                    }
                }
                break;

            case 3:
                // CRC16
                {
                    switch( this.indexReceiver )
                    {
                    case 0:
                        {
                            this.crc16Received = data;
                        }
                        break;
                    
                    case 1:
                        {
                            this.crc16Received = this.crc16Received + (data << 8);
                            flagComplete = true;
                        }
                        break;
                    }
                }
                break;

            default:
                {
                    flagContinue = false;
                }
                break;
            }

            // 데이터 전송 완료 처리
            if( flagComplete == true )
            {
                if( this.crc16Calculated == this.crc16Received )
                {
                    this.handlerForDevice();
                }

                flagContinue = false;
            }

            // 데이터 처리 결과에 따라 인덱스 변수 처리
            if( flagContinue == true )
            {
                if( flagSessionNext == true )
                {
                    this.indexSession++;
                    this.indexReceiver = 0;             
                }
                else
                {
                    this.indexReceiver++;
                }
            }
            else
            {
                this.indexSession       = 0;        // 수신 받는 데이터의 세션
                this.indexReceiver      = 0;        // 수신 받는 데이터의 세션 내 위치
            }
        }
    }
    
    // #endregion Data Receiver from Device



    /***************************************************************************************
     *  Communciation - 장치로부터 받은 데이터 수신 처리
     ***************************************************************************************/
    // #region Data Handler for received data from Device

    // 장치로부터 받은 데이터 블럭 처리
    handlerForDevice()
    {
        // skip 할 대상만 case로 등록
        switch( this.dataType )
        {
        case 0x02:  break;      // Ack
        case 0x40:  break;      // State (0x40)
        case 0x41:  break;      // 
        case 0x42:  break;      // 
        case 0x43:  break;      // 
        case 0x44:  break;      // 
        case 0x45:  break;      // 
        case 0x70:  break;      // 
        case 0x71:  break;      // 
        case 0xA1:  break;      // 

        default:
            {
                this.log("Receive_From_Device / From: " + this.from + " / To: " + this.to + " / Type: " + this.dataType + " / ", this.dataBlock);
            }
            break;
        }

        this.timeReceive = (new Date()).getTime();

        // 상대측에 정상적으로 데이터를 전달했는지 확인
        switch( this.dataType )
        {
        case 0x02:  // Ack
            if( this.dataBlock.length == 7 )
            {
                // Device -> Entry 
                let ack             = this.ack;
                ack._updated        = true;
                ack.ack_systemTime  = this.extractUInt32(this.dataBlock, 0);
                ack.ack_dataType    = this.extractUInt8(this.dataBlock, 4);
                ack.ack_crc16       = this.extractUInt16(this.dataBlock, 5);

                // ping에 대한 ack는 로그 출력하지 않음
                if( ack.ack_dataType != 0x01 )
                {
                    console.log("Receive_From_Device - Ack / From: " + this.from + " / SystemTime: " + ack.ack_systemTime + " / DataType: " + ack.ack_dataType + " / Repeat: " + this.countTransferRepeat + " / Crc16Transfer: " + this.crc16Transfered + " / Crc16Get: " + ack.ack_crc16);
                }

                // 마지막으로 전송한 데이터에 대한 응답을 받았다면 
                if( this.bufferTransfer != undefined &&
                    this.bufferTransfer.length > 0 &&
                    this.dataTypeLastTransfered == ack.ack_dataType &&
                    this.crc16Transfered == ack.ack_crc16 )
                {
                    this.bufferTransfer.shift();
                    this.countTransferRepeat = 0;
                }
            }
            break;

        default:
            {
                // 마지막으로 요청한 데이터를 받았다면 
                if( this.bufferTransfer != undefined &&
                    this.bufferTransfer.length > 0 &&
                    this.dataTypeLastTransfered == this.dataType )
                {
                    this.bufferTransfer.shift();
                    this.countTransferRepeat = 0;
                    
                    console.log("Receive_From_Device - Response / From: " + this.from + " / DataType: " + this.dataType);
                }
            }
            break;
        }


        switch( this.dataType )
        {
        case 0x40:  // State
            if( this.dataBlock.length == 7 )
            {
                // Device -> Entry 
                let state                       = this.state;
                state._updated                  = true;
                state.state_modeSystem          = this.extractUInt8(this.dataBlock, 0);
                state.state_modeFlight          = this.extractUInt8(this.dataBlock, 1);
                state.state_modeControlFlight   = this.extractUInt8(this.dataBlock, 2);
                state.state_modeMovement        = this.extractUInt8(this.dataBlock, 3);
                state.state_headless            = this.extractUInt8(this.dataBlock, 4);
                state.state_sensorOrientation   = this.extractUInt8(this.dataBlock, 5);
                state.state_battery             = this.extractUInt8(this.dataBlock, 6);
    
                //console.log("Receive_From_Device - state: " + state.state_modeVehicle);
            }
            break;
        
        
        // 아래의 주석 데이터는 State와 InformationAssembledForEntry로 대체함
        /*
        case 0x42:  // Position
            if( this.dataBlock.length == 12 )
            {
                // Device -> Entry 
                let position           = this.position;
                position._updated      = true;
                position.position_x    = this.extractFloat32(this.dataBlock, 0);
                position.position_y    = this.extractFloat32(this.dataBlock, 4);
                position.position_z    = this.extractFloat32(this.dataBlock, 8);
    
                //console.log("Receive_From_Device - position: " + position.position_x + ", " + position.position_y);
            }
            break;


        case 0x43:  // Altitude
            if( this.dataBlock.length == 16 )
            {
                // Device -> Entry 
                let altitude                    = this.altitude;
                altitude._updated               = true;
                altitude.altitude_temperature   = this.extractFloat32(this.dataBlock, 0);
                altitude.altitude_pressure      = this.extractFloat32(this.dataBlock, 4);
                altitude.altitude_altitude      = this.extractFloat32(this.dataBlock, 8);
                altitude.altitude_rangeHeight   = this.extractFloat32(this.dataBlock, 12);
    
                //console.log("Receive_From_Device - altitude: " + altitude.altitude_temperature + ", " + altitude.altitude_altitude);
            }
            break;


        case 0x44:  // Motion
            if( this.dataBlock.length == 18 )
            {
                // Device -> Entry 
                let motion                  = this.motion;
                motion._updated             = true;
                motion.motion_accX          = (this.extractInt16(this.dataBlock, 0) * 10).toFixed(3);
                motion.motion_accY          = (this.extractInt16(this.dataBlock, 2) * 10).toFixed(3);
                motion.motion_accZ          = (this.extractInt16(this.dataBlock, 4) * 10).toFixed(3);
                motion.motion_gyroRoll      = (this.extractInt16(this.dataBlock, 6)).toFixed(3);
                motion.motion_gyroPitch     = (this.extractInt16(this.dataBlock, 8)).toFixed(3);
                motion.motion_gyroYaw       = (this.extractInt16(this.dataBlock, 10)).toFixed(3);
                motion.motion_angleRoll     = this.extractInt16(this.dataBlock, 12);
                motion.motion_anglePitch    = this.extractInt16(this.dataBlock, 14);
                motion.motion_angleYaw      = this.extractInt16(this.dataBlock, 16);
    
                //console.log("Receive_From_Device - motion: " + motion.motion_angleRoll + ", " + motion.motion_anglePitch + ", " + motion.motion_angleYaw);
            }
            break;


        case 0x45:  // Range
            if( this.dataBlock.length == 12 )
            {
                // Device -> Entry 
                let range               = this.range;
                range._updated          = true;
                range.range_left        = this.extractInt16(this.dataBlock, 0);
                range.range_front       = this.extractInt16(this.dataBlock, 2);
                range.range_right       = this.extractInt16(this.dataBlock, 4);
                range.range_rear        = this.extractInt16(this.dataBlock, 6);
                range.range_top         = this.extractInt16(this.dataBlock, 8);
                range.range_bottom      = this.extractInt16(this.dataBlock, 10);
    
                //console.log("Receive_From_Device - range: " + range.range_left + ", " + range.range_front + ", " + range.range_right + ", " + range.range_rear + ", " + range.range_top + ", " + range.range_bottom);
            }
            break;
        // */


        case 0x70:  // Button
            if( this.dataBlock.length == 3 )
            {
                // Device -> Entry 
                let button              = this.button;
                button._updated         = true;
                button.button_button    = this.extractUInt16(this.dataBlock, 0);
                button.button_event     = this.extractUInt8(this.dataBlock, 2);

                //console.log("Receive_From_Device - Button: " + button.button_button + ", " + button.button_event);
            }
            break;


        case 0x71:  // Joystick
            if( this.dataBlock.length == 8 )
            {
                // Device -> Entry 
                let joystick                        = this.joystick;
                joystick._updated                   = true;
                joystick.joystick_left_x            = this.extractInt8(this.dataBlock,  0);
                joystick.joystick_left_y            = this.extractInt8(this.dataBlock,  1);
                joystick.joystick_left_direction    = this.extractUInt8(this.dataBlock, 2);
                joystick.joystick_left_event        = this.extractUInt8(this.dataBlock, 3);
                joystick.joystick_right_x           = this.extractInt8(this.dataBlock,  4);
                joystick.joystick_right_y           = this.extractInt8(this.dataBlock,  5);
                joystick.joystick_right_direction   = this.extractUInt8(this.dataBlock, 6);
                joystick.joystick_right_event       = this.extractUInt8(this.dataBlock, 7);

                //console.log("Receive_From_Device - Joystick: " + joystick.joystick_left_x + ", " + joystick.joystick_left_y + ", " + joystick.joystick_right_x + ", " + joystick.joystick_right_y);
            }
            break;


        case 0xA1:  // Information Assembled For Entry 자주 갱신되는 데이터 모음(엔트리)
            if( this.dataBlock.length == 18 )
            {
                // Device -> Entry 
                let informationAssembledForEntry            = this.informationAssembledForEntry;
                informationAssembledForEntry._updated       = true;
                informationAssembledForEntry.informationAssembledForEntry_angleRoll      = this.extractInt16(this.dataBlock, 0);
                informationAssembledForEntry.informationAssembledForEntry_anglePitch     = this.extractInt16(this.dataBlock, 2);
                informationAssembledForEntry.informationAssembledForEntry_angleYaw       = this.extractInt16(this.dataBlock, 4);
                informationAssembledForEntry.informationAssembledForEntry_positionX      = this.extractInt16(this.dataBlock, 6) / 100.0;
                informationAssembledForEntry.informationAssembledForEntry_positionY      = this.extractInt16(this.dataBlock, 8) / 100.0;
                informationAssembledForEntry.informationAssembledForEntry_positionZ      = this.extractInt16(this.dataBlock, 10) / 100.0;
                informationAssembledForEntry.informationAssembledForEntry_rangeHeight    = this.extractInt16(this.dataBlock, 12) / 100.0;
                informationAssembledForEntry.informationAssembledForEntry_altitude       = this.extractFloat32(this.dataBlock, 14);
    
                //console.log("Receive_From_Device - Information Assembled For Entry: " + this.dataBlock.length + ", " + this.dataBlock);
            }
            break;


        default:
            break;
        }
    }
    // #endregion Data Receiver for received data from Device



    /***************************************************************************************
     *  Communciation - 데이터를 장치로 전송(주기적으로 호출됨)
     ***************************************************************************************/
    // #region Data Transfer

    // 장치에 데이터 전송
    transferForDevice()
    {
        let now = (new Date()).getTime();

        if( now < this.timeTransferNext )
        {
            return null;
        }
        
        this.timeTransferNext = now + this.timeTransferInterval;

        if( this.bufferTransfer == undefined )
        {
            this.bufferTransfer = [];
        }

        this.countReqeustDevice++;

        if( this.bufferTransfer.length == 0 )
        {
            // 예약된 요청이 없는 경우 데이터 요청 등록(현재는 자세 데이터 요청)
            switch( this.targetDevice )
            {
            case 0x10:
                {
                    switch( this.countReqeustDevice % 6 )
                    {
                    case 0:    return this.ping(0x10);                     // 드론
                    case 2:    return this.ping(0x20);                     // 조종기
                    case 4:    return this.reserveRequest(0x10, 0x40);     // 드론
                    /*
                    case 6:    return this.reserveRequest(0x10, 0x42);     // 드론
                    case 8:    return this.reserveRequest(0x10, 0x43);     // 드론
                    case 10:   return this.reserveRequest(0x10, 0x44);     // 드론
                    case 12:   return this.reserveRequest(0x10, 0x45);     // 드론
                    // */
                    default:   return this.reserveRequest(0x10, 0xA1);     // 드론, 자주 갱신되는 데이터 모음(엔트리)
                    }
                }
                break;

            default:
                {
                    return this.ping(this.targetDevice);
                }
                break;
            }
        }
        else
        {
            // 예약된 요청이 있는 경우
            switch( this.targetDevice )
            {
            case 0x10:
                {
                    switch (this.countReqeustDevice % 3)
                    {
                        case 1:     return this.reserveRequest(0x10, 0xA1);     // 드론, 자주 갱신되는 데이터 모음(엔트리)
                        default:    break;
                    }
                }
                break;

            default:
                {
                    switch( this.countReqeustDevice % 10 )
                    {
                    case 0:     return this.ping(this.targetDevice);
                    default:    break;
                    }
                }
                break;
            }
        }
    
        // 예약된 데이터 전송 처리
        let arrayTransfer = this.bufferTransfer[0];             // 전송할 데이터 배열(첫 번째 데이터 블럭 전송)
        if( arrayTransfer[2] == 0x04 )
        {
            this.dataTypeLastTransfered = arrayTransfer[6];     // 요청한 데이터의 타입(Request인 경우)
        }
        else
        {
            this.dataTypeLastTransfered = arrayTransfer[2];     // 전송한 데이터의 타입(이외의 모든 경우)
        }
        this.countTransferRepeat++;
        this.timeTransfer = (new Date()).getTime();
    
        this.crc16Transfered = (arrayTransfer[arrayTransfer.length - 1] << 8) | (arrayTransfer[arrayTransfer.length - 2]);
    
        //this.log("Data Transfer - Repeat(" + this.bufferTransfer.length + ") : " + this.countTransferRepeat, this.bufferTransfer[0]);
        //console.log("Data Transfer - Repeat: " + this.countTransferRepeat, this.bufferTransfer[0]);
    
        // maxTransferRepeat 이상 전송했음에도 응답이 없는 경우엔 다음으로 넘어감
        if( this.countTransferRepeat >= this.maxTransferRepeat)
        {
            this.bufferTransfer.shift();
            this.countTransferRepeat = 0;
        }
    
        //this.log("Module.prototype.transferForDevice()", arrayTransfer);
    
        return arrayTransfer;
    }

    // #endregion Data Transfer



    /***************************************************************************************
     *  Communciation - Entry-HW 내부 코드용 데이터 전송 명령
     ***************************************************************************************/
    // #region Data Transfer Functions for Entry-HW internal code

    // Ping
    ping(target)
    {
        let dataArray = [];

        // Start Code
        this.addStartCode(dataArray);
        
        let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
        let dataLength = 8;                     // 데이터의 길이

        // Header
        dataArray.push(0x01);           // Data Type (UpdateLookupTarget)
        dataArray.push(dataLength);     // Data Length
        dataArray.push(0x82);           // From (네이버 엔트리)
        dataArray.push(target);         // To

        // Data Array
        dataArray.push(0x00);           // systemTime
        dataArray.push(0x00);
        dataArray.push(0x00);
        dataArray.push(0x00);
        dataArray.push(0x00);           // u32 -> u64
        dataArray.push(0x00);
        dataArray.push(0x00);
        dataArray.push(0x00);

        // CRC16
        this.addCRC16(dataArray, indexStart, dataLength);

        //this.log("ping()", dataArray);
        
        return dataArray;
    }


    // 데이터 요청
    reserveRequest(target, dataType)
    {
        let dataArray = [];

        // Start Code
        this.addStartCode(dataArray);
        
        let indexStart = dataArray.length;      // 배열에서 데이터를 저장하기 시작하는 위치
        let dataLength = 1;                     // 데이터의 길이

        // Header
        dataArray.push(0x04);           // Data Type (Request)
        dataArray.push(dataLength);     // Data Length
        dataArray.push(0x82);           // From (네이버 엔트리)
        dataArray.push(target);         // To

        // Data Array
        dataArray.push(dataType);       // Request DataType

        // CRC16
        this.addCRC16(dataArray, indexStart, dataLength);

        //this.log("reserveRequest()", dataArray);
        
        return dataArray;
    }

    // #endregion Data Transfer Functions for Entry-HW internal code



    /***************************************************************************************
     *  자바스크립트 바이너리 핸들링
     *  http://mohwa.github.io/blog/javascript/2015/08/31/binary-inJS/
     ***************************************************************************************/
    // #region Functions for Binary Handling

    extractInt8(dataArray, startIndex)
    {
        let value = this.extractUInt8(dataArray, startIndex);
        if( (value & 0x80) != 0)
        {
            value = -(0x100 - value);
        }
        return value;
    }


    extractUInt8(dataArray, startIndex)
    {
        if( dataArray.length >= startIndex + 1 )
        {
            let value = dataArray[startIndex];
            return value;
        }
        else
        {
            return 0;
        }
    }


    extractInt16(dataArray, startIndex)
    {
        let value = this.extractUInt16(dataArray, startIndex);
        if( (value & 0x8000) != 0)
        {
            value = -(0x10000 - value);
        }
        return value;
    }


    extractUInt16(dataArray, startIndex)
    {
        if( dataArray.length >= startIndex + 2 )
        {
            let value = ((dataArray[startIndex + 1]) << 8) + dataArray[startIndex];
            return value;
        }
        else
        {
            return 0;
        }
    }


    extractInt32(dataArray, startIndex)
    {
        let value = this.extractUInt32(dataArray, startIndex);
        if( (value & 0x80000000) != 0)
        {
            value = -(0x100000000 - value);
        }
        return value;
    }


    extractUInt32(dataArray, startIndex)
    {
        if( dataArray.length >= startIndex + 4 )
        {
            let value = ((dataArray[startIndex + 3]) << 24) + ((dataArray[startIndex + 2]) << 16) + ((dataArray[startIndex + 1]) << 8) + dataArray[startIndex];
            return value;
        }
        else
        {
            return 0;
        }
    }


    extractFloat32(dataArray, startIndex)
    {
        if (dataArray.length >= startIndex + 4)
        {
            let buffer = new ArrayBuffer(4);
            let float32View = new Float32Array(buffer, 0, 1);
            let uint8View = new Uint8Array(buffer, 0, 4)
            uint8View[0] = dataArray[startIndex];
            uint8View[1] = dataArray[startIndex + 1];
            uint8View[2] = dataArray[startIndex + 2];
            uint8View[3] = dataArray[startIndex + 3];
    
            return float32View[0].toFixed(2);
        }
        else
        {
            return 0;
        }
    }


    // 값 추출
    getByte0(b)
    {
        return (b & 0xff);
    }

    getByte1(b)
    {
        return ((b >> 8) & 0xff);
    }

    getByte2(b)
    {
        return ((b >> 16) & 0xff);
    }

    getByte3(b)
    {
        return ((b >> 24) & 0xff);
    }
    // #endregion Functions for Binary Handling



    /***************************************************************************************
     *  CRC16
     ***************************************************************************************/
    // #region CRC16

    /*
    * Copyright 2001-2010 Georges Menie (www.menie.org)
    * All rights reserved.
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *
    *     * Redistributions of source code must retain the above copyright
    *       notice, this list of conditions and the following disclaimer.
    *     * Redistributions in binary form must reproduce the above copyright
    *       notice, this list of conditions and the following disclaimer in the
    *       documentation and/or other materials provided with the distribution.
    *     * Neither the name of the University of California, Berkeley nor the
    *       names of its contributors may be used to endorse or promote products
    *       derived from this software without specific prior written permission.
    *
    * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
    * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
    * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
    createCRC16Array()
    {
        this.crc16table =
        [
            0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
            0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
            0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
            0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
            0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
            0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
            0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
            0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
            0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
            0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
            0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
            0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
            0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
            0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
            0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
            0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
            0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
            0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
            0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
            0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
            0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
            0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
            0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
            0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
            0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
            0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
            0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
            0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
            0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
            0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
            0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
            0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
        ];
    }

    calcCRC16(data, crc)
    {
        if( data > 255 )
        {
            throw new RangeError();
        }

        let index   = ((crc>>8) ^ data) & 0x00FF;
        let crcNext = ((crc<<8) & 0xFFFF) ^ this.crc16table[index];

        return crcNext;
    }
    // #endregion CRC16



    /***************************************************************************************
     *  로그 출력
     ***************************************************************************************/
    // #region Functions for log

    log(message, data = 'undefined')
    {
        // 로그를 출력하지 않으려면 아래 주석을 활성화 할 것
        //*
        let strInfo = "";

        switch( typeof data )
        {
        case "object":
            {
                strInfo = " / [ " + this.convertByteArrayToHexString(data) + " ]";
                console.log(message + " / " + (typeof data) + strInfo);
            }
            break;

        default:
            {
                console.log(message);
            }
            break;
        }

        // */
    }


    // 바이트 배열을 16진수 문자열로 변경 
    convertByteArrayToHexString(data)
    {
        let strHexArray = "";
        let strHex;

        if( typeof data == "object" && data.length > 1 )
        {
            for(let i=0; i<data.length; i++)
            {
                strHex = data[i].toString(16).toUpperCase();
                strHexArray += " ";
                if( strHex.length == 1 )
                {
                    strHexArray += "0";
                }
                strHexArray += strHex;
            }
            strHexArray = strHexArray.substr(1, strHexArray.length - 1);
        }
        else
        {
            strHexArray = data.toString();
        }
        
        return strHexArray;
    }


    // 입력받은 문자열 처리
    // https://stackoverflow.com/questions/6226189/how-to-convert-a-string-to-bytearray
    stringToAsciiByteArray(str)
    {
        let bytes = [];
        for(let i=0; i<str.length; i++)
        {
            let charCode = str.charCodeAt(i);
            if( charCode > 0xFF )  // char > 1 byte since charCodeAt returns the UTF-16 value
            {
                // throw new Error('Character ' + String.fromCharCode(charCode) + ' can\'t be represented by a US-ASCII byte.');
                continue;
            }
            bytes.push(charCode);
        }
        return bytes;
    }

    // #endregion Functions for log

}


module.exports = byrobot_base;

