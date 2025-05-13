const vehicleRepository = require('../repositories/vehicleRepository');
const partRepository = require('../repositories/partRepository');
const mileageRepository = require('../repositories/mileageRepository');
const { sendEmail } = require('../utils/mailer');
const logger = require('../utils/logger');

const predictVehicleMileage = async (vehicleId, days) => {
    try {
        const mileages = await mileageRepository.getMileagesbyVehicleId(vehicleId);

        if (mileages.length < 2) {
            return 0;
        }

        let totalMileage = 0;
        for (const m of mileages) {
            totalMileage += m.mileage;
        }

        const latestDate = mileages[0].date;
        const earliestDate = mileages[mileages.length - 1].date;
        const dayDiff = Math.floor((latestDate - earliestDate) / (1000 * 60 * 60 * 24));

        return mileages[0].mileage + Math.floor((totalMileage / dayDiff) * days);

    } catch (error) {
        logger.error('Error predicting vehicle mileage:', error);
        return 0;
    }
}

const checkAllPartStatus = async (vehicleId) => {
    const parts = await partRepository.getPartsbyVehicleId(vehicleId);

    let isAllEmailSent = true;
    for (const part of parts) {
        isAllEmailSent = isAllEmailSent && checkPartStatus(part.id);
    }

    return isAllEmailSent;
}

const checkPartStatus = async (id) => {
    try {
        const part = await partRepository.getPartbyId(id);
        const predictedMileage = await predictVehicleMileage(vehicleId, 7);
        const currentMileage = (await mileageRepository.getMileagesbyVehicleId(vehicleId))[0].mileage;

        if ((part.lifetime_mileage + part.installed_mileage) <= currentMileage && part.status != 'MAINTAINED/REPLACED') {
            const vehicle = await vehicleRepository.updateVehicleStatus(vehicleId, 'MAINTENANCE_OVERDUE');
            const updatedPart = await partRepository.updatePartStatus(part.id, 'MAINTENANCE_OVERDUE');
            const account = await accountRepository.getAccountbyId(vehicle.owner_id);
            return await sendMaintenanceOverdueEmail(vehicle, updatedPart, account, currentMileage);
        } else if (((part.lifetime_mileage + part.installed_mileage) - predictedMileage) <= 0 && part.status != 'MAINTAINED/REPLACED') {
            const vehicle = await vehicleRepository.updateVehicleStatus(vehicleId, 'MAINTENANCE_DUE');
            const updatedPart = await partRepository.updatePartStatus(part.id, 'MAINTENANCE_DUE');
            const account = await accountRepository.getAccountbyId(vehicle.owner_id);
            return await sendMaintenanceDueEmail(vehicle, updatedPart, account, currentMileage);
        }
    } catch (error) {
        logger.error('Error checking vehicle and part status:', error);
        return false;
    }
}

const sendMaintenanceDueEmail = async (vehicle, part, account, currentMileage) => {
    const subject = 'Maintenance Reminder for Your Vehicle - ServiLog';

    const textContent = `
        Hello, ${account.name}
        
        Based on your driving pattern, a part on your vehicle will require maintenance within 7 days.

        Vehicle:
        - Name: ${vehicle.name}
        - Brand: ${vehicle.brand}
        - Model: ${vehicle.model}
        - Current Mileage: ${currentMileage} KM

        Part:
        - Name: ${part.name}
        - Brand: ${part.brand}
        - Model: ${part.model}
        - Installed On: ${part.install_mileage} KM
        - Lifetime: ${part.lifetime_mileage} KM

        Please prepare to replace this part to ensure optimal vehicle performance and safety.

        Best regards,
        The ServiLog Team

        © 2025 ServiLog. Smart Maintenance, Smooth Journey.
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maintenance Reminder - ServiLog</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #FECB00;
                color: #D52B1E;
                text-align: center;
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .body {
                padding: 20px;
            }
            .body p {
                margin: 0 0 15px;
                font-size: 16px;
                line-height: 1.5;
            }
            .body .info-block {
                background-color: #f2f2f2;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 15px;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                padding: 10px 20px;
                background-color: #f8f9fa;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>Maintenance Reminder</h1>
            </div>
            <!-- Body -->
            <div class="body">
                <p>Hello, <strong>${account.name}</strong>!</p>
                <p>Based on your driving behavior, our system estimates that one of your vehicle's parts will require maintenance within the next 7 days.</p>

                <div class="info-block">
                    <strong>Vehicle Details:</strong><br>
                    Name: ${vehicle.name}<br>
                    Brand: ${vehicle.brand}<br>
                    Model: ${vehicle.model}<br>
                    Current Mileage: ${currentMileage} KM
                </div>

                <div class="info-block">
                    <strong>Part Details:</strong><br>
                    Name: ${part.name}<br>
                    Brand: ${part.brand}<br>
                    Model: ${part.model}<br>
                    Installed On: ${part.install_mileage} KM<br>
                    Lifetime: ${part.lifetime_mileage} KM
                </div>

                <p>Please consider servicing or replacing this part soon to ensure optimal performance and safety.</p>
                <p>Stay safe and thank you for using <strong>ServiLog</strong>.</p>
            </div>
            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 ServiLog. Smart Maintenance, Smooth Journey.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return sendEmail(account.email, subject, textContent, htmlContent);
}

const sendMaintenanceOverdueEmail = async (vehicle, part, account, currentMileage) => {
    const subject = 'Urgent Maintenance Reminder for Your Vehicle - ServiLog';

    const textContent = `
        Hello, ${account.name}
        
        One of the parts in your vehicle has exceeded its lifetime mileage limit and requires immediate maintenance.

        Vehicle:
        - Name: ${vehicle.name}
        - Brand: ${vehicle.brand}
        - Model: ${vehicle.model}
        - Current Mileage: ${currentMileage} KM

        Overdue Part:
        - Name: ${part.name}
        - Brand: ${part.brand}
        - Model: ${part.model}
        - Installed On: ${part.install_mileage} KM
        - Lifetime: ${part.lifetime_mileage} KM

        Please take action as soon as possible to maintain the safety and performance of your vehicle.

        Best regards,
        The ServiLog Team

        © 2025 ServiLog. Smart Maintenance, Smooth Journey.
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Overdue Maintenance Alert - ServiLog</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                color: #333;
            }

            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 8px;
                overflow: hidden;
            }

            .header {
                background-color: #FECB00;
                color: #D52B1E;
                text-align: center;
                padding: 20px;
            }

            .header h1 {
                margin: 0;
                font-size: 24px;
            }

            .body {
                padding: 20px;
            }

            .body p {
                margin: 0 0 15px;
                font-size: 16px;
                line-height: 1.5;
            }

            .body .info-block {
                background-color: #fff4f4;
                padding: 15px;
                border-radius: 6px;
                border-left: 5px solid #D52B1E;
                margin-bottom: 15px;
            }

            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                padding: 10px 20px;
                background-color: #f8f9fa;
            }
        </style>
    </head>

    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>Overdue Maintenance Alert</h1>
            </div>
            <!-- Body -->
            <div class="body">
                <p>Hello, <strong>${account.name}</strong>!</p>
                <p>Our system has detected that one of the parts in your vehicle has exceeded its lifetime mileage limit
                    and <strong>requires immediate maintenance</strong>.</p>

                <div class="info-block">
                    <strong>Vehicle Details:</strong><br>
                    Name: ${vehicle.name}<br>
                    Brand: ${vehicle.brand}<br>
                    Model: ${vehicle.model}<br>
                    Current Mileage: ${currentMileage} KM
                </div>

                <div class="info-block">
                    <strong>Overdue Part Details:</strong><br>
                    Name: ${part.name}<br>
                    Brand: ${part.brand}<br>
                    Model: ${part.model}<br>
                    Installed On: ${part.install_mileage} KM<br>
                    Lifetime: ${part.lifetime_mileage} KM
                </div>

                <p>Please schedule a service as soon as possible to avoid potential breakdowns or further damage.</p>
                <p>Stay safe,<br>The ServiLog Team</p>
            </div>
            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 ServiLog. Smart Maintenance, Smooth Journey.</p>
            </div>
        </div>
    </body>

    </html>
    `;

    return sendEmail(account.email, subject, textContent, htmlContent);
}

module.exports = {
    checkAllPartStatus,
    checkPartStatus
}