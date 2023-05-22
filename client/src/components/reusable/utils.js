import { Box } from "@mui/material";

export const generateRGBColor = (seed) => {
    var numericSeed = 0;
    for (var i = 0; i < seed.length; i++) {
        numericSeed += seed.charCodeAt(i);
    }

    var x = Math.sin(numericSeed++) * 10000;
    var r, g, b;

    do {
        r = Math.floor((x - Math.floor(x)) * 256);
        g = Math.floor((x * 10 - Math.floor(x * 10)) * 256);
        b = Math.floor((x * 100 - Math.floor(x * 100)) * 256);
    } while (r === 0 || r === 255 || g === 0 || g === 255 || b === 0 || b === 255);

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}


export const defaultUserIcon = (user) => {
    return (
        <Box
            sx={{
                width: "50px",
                height: "50px",
                backgroundColor: generateRGBColor(user?.username),
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
            }}
        >
            <span
                sx={{
                    color: "#000",
                    fontSize: "20px",
                }}
            >

                {user?.username.charAt(0)}
            </span>
        </Box>
    );
};