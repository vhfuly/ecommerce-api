import { app, PORT } from './app';

app.listen(PORT, () => {
    console.log(`Server is running in //localhost:${PORT}`);
});
