import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploy AccessControlManager only (simplified version without Timelock)
 * Deployer keeps DEFAULT_ADMIN_ROLE
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Deploying AccessControlManager with deployer: ${deployer}`);

  const acmDeployment = await deploy("AccessControlManager", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: true,
  });

  console.log(`AccessControlManager deployed at: ${acmDeployment.address}`);
  console.log(`Deployer (${deployer}) has DEFAULT_ADMIN_ROLE`);
};

func.tags = ["ACMOnly"];

export default func;
