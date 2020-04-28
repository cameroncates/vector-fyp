const __P = new IMG_FUNCTIONS();
const __HTML = new HtmlRender();
const __F = new Filter();
    
class EDGE_DETECTOR
{
    constructor() 
    {
        // __P._IMAGE_LOAD('IMAGES/DSC_1919.jpg', (DATA) => 
        // {   

        //     this._IMAGE_EXTRACT(DATA);
        // });
    }
    _CHANGE_COLOR(ODATA, COLOR, CLUSTER_PIX, callback) {
        let RGB = __P.hexToRgb(COLOR.new)
        for(let y=0; y<ODATA.height; y++)
        {
            for(let x=0; x<ODATA.width; x++)
            {
                let old_color = __P._GET_ALL_PIX_RGB(ODATA, x, y)
                if(Math.abs(old_color.R - COLOR.old.R) < 5 && Math.abs(old_color.G - COLOR.old.G) < 5 && Math.abs(old_color.B - COLOR.old.B) < 5) 
                    __P._SET_ALL_PIX_RGB(ODATA, x, y, RGB.R, RGB.G, RGB.B);
            }
        }
        // __P._APPEND_CANVAS(ODATA)
        callback(ODATA)
    }
    _IMAGE_EXTRACT(ODATA, callback)
    {
        let DATA = __P._DUPLICATE(ODATA);
        let CLUSTER = [];
        let EXIST;
        for(let i=0; i<DATA.data.length; i+=4)
        {
            let LAB = __P._RGB2LAB([DATA.data[i], DATA.data[i+1], DATA.data[i+2]]);
            EXIST = false;
            for(let j=0; j<CLUSTER.length; j++)
            {
                CLUSTER[j].LAB = {
                    L: CLUSTER[j].L/CLUSTER[j].C,
                    A: CLUSTER[j].A/CLUSTER[j].C,
                    B: CLUSTER[j].B/CLUSTER[j].C
                }
                if((__P._ECQUALIDIAN_DISTANCE(CLUSTER[j].LAB, LAB) <= 35))
                {
                    CLUSTER[j].C += 1;
                    CLUSTER[j].i.push(i/4);
                    CLUSTER[j].L += LAB.L;
                    CLUSTER[j].A += LAB.A;
                    CLUSTER[j].B += LAB.B;
                    EXIST = true;
                    break;
                }
            }
            if(CLUSTER.length == 0 || !EXIST)
            {
                CLUSTER.push(
                    {
                        LAB: LAB,
                        L: LAB.L, A: LAB.A, B: LAB.B,
                        C: 1,
                        i: [i/4]
                    } 
                )
            }
        }
        console.log(CLUSTER, 'CLUSTER');
        let CLEAR_DATA = __P._DUPLICATE(DATA);
        for(let y=0; y<DATA.height; y++)
        {
            for(let x=0; x<DATA.width; x++)
            {
                __P._SET_ALL_PIX_RGB(CLEAR_DATA, x, y, 0, 0, 0);
            }
        }
        let CLUSTER_DATA = [];
        let COLORS = []
        for(let i=0; i<CLUSTER.length; i++)
        {
            DATA = __P._DUPLICATE(CLEAR_DATA);
            let RGB = __P._lab2rgb(CLUSTER[i].LAB)
            for(let j=0; j<CLUSTER[i].i.length; j++)
            {
                __P._SET_PIX_INDEX_RGB(ODATA, CLUSTER[i].i[j], RGB)
                __P._SET_PIX_INDEX_RGB(DATA, CLUSTER[i].i[j], RGB)
            }
            // __P._APPEND_COLOR(RGB);
            CLUSTER_DATA.push(DATA);
            COLORS.push(RGB)
        }

        this._DETECT_EDGES(CLUSTER_DATA, CLUSTER, {
            clusters_pix: CLUSTER,
            clusters: CLUSTER_DATA,
            colors: COLORS,
            final_img: ODATA
        }, callback);
    }
    _DETECT_EDGES(__D, __C, obj, callback)
    {
        let FILTERS = __P._GET_SOBEL_FILTERS();
        let EDGES = []
        for(let i=0; i<__C.length; i++)
        {
            let DUP = __P._DUPLICATE(__D[i]);
            for(let j=0; j<__C[i].i.length; j++)
            {
                let AXIS = __P._GET_AXIS(__D[i], __C[i].i[j]);
                let MATRIX = __P._GET_NEIGHBOURS_PIX_SKIP_EDGE_RGB(__D[i], AXIS.X, AXIS.Y);           
                let OBJECT = __P._MULTIPLY_OBJECT_ARR_RGB(FILTERS, MATRIX);
                let MAGNITUDE = __P._FIND_MAGNITUDE_RGB(OBJECT);
                if(MAGNITUDE < 40)
                    __P._SET_ALL_PIX(DUP, AXIS.X, AXIS.Y, 0);
               else
                    __P._SET_ALL_PIX(DUP,  AXIS.X,  AXIS.Y, 255);
            }
            EDGES.push(DUP)
        }
        callback({...obj, edges: EDGES})
    }

}

const EDGE = new EDGE_DETECTOR();
