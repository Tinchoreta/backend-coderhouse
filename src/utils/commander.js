import { Command } from 'commander';

const commander = new Command();

commander
    .option('--mode <mode>', 'Modo de ejecución de nuesta app', 'development')
    .parse();

export default commander;