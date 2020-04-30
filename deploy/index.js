"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require("@aws-cdk/aws-rds");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
const ecs = require("@aws-cdk/aws-ecs");
require("dotenv").config();
const DB_PORT = Number(process.env["DB_PORT"]);
const DB_NAME = process.env["DB_NAME"];
const DB_USER = process.env["DB_USER"];
const DB_PASSWORD = process.env["DB_PASSWORD"];
const DB_HOST = process.env["DB_HOST"];
class WordpressStack extends cdk.Stack {
    constructor(construct, id, props) {
        super(construct, id, props);
        const image = ecs.ContainerImage.fromRegistry("wordpress");
        const vpc = new ec2.Vpc(this, "vpc", {
            maxAzs: 2,
        });
        const wordpressSg = new ec2.SecurityGroup(this, "wp-sg", {
            vpc: vpc,
            description: "Wordpress security group",
        });
        new rds.DatabaseInstance(this, "db", {
            engine: rds.DatabaseInstanceEngine.MYSQL,
            masterUsername: DB_USER,
            masterUserPassword: cdk.SecretValue.plainText(DB_PASSWORD),
            instanceClass: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.SMALL),
            storageEncrypted: false,
            multiAz: false,
            autoMinorVersionUpgrade: false,
            allocatedStorage: 25,
            storageType: rds.StorageType.GP2,
            backupRetention: cdk.Duration.days(3),
            deletionProtection: false,
            databaseName: DB_NAME,
            vpc,
            securityGroups: [wordpressSg],
            port: 3306,
        });
        const cluster = new ecs.Cluster(this, "ecs-cluster", {
            vpc,
        });
        cluster.connections.addSecurityGroup(wordpressSg);
        const wordpressService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "wordpress-service", {
            cluster: cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: {
                image: image,
                environment: {
                    WORDPRESS_DB_HOST: DB_HOST,
                    WORDPRESS_DB_USER: DB_USER,
                    WORDPRESS_DB_PASSWORD: DB_PASSWORD,
                    WORDPRESS_DB_NAME: DB_NAME,
                },
                enableLogging: true,
            },
            memoryLimitMiB: 512,
            publicLoadBalancer: true,
        });
        wordpressService.service.connections.allowTo(wordpressSg, ec2.Port.tcp(DB_PORT));
    }
}
const app = new cdk.App();
new WordpressStack(app, "FormsStackWP", {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION,
    },
    description: "Fargate WordPress deployment",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDBEQUEwRDtBQUMxRCx3Q0FBd0M7QUFDeEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFXLENBQUM7QUFDekQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQVcsQ0FBQztBQUNqRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBVyxDQUFDO0FBQ2pELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFXLENBQUM7QUFDekQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQVcsQ0FBQztBQUNqRCxNQUFNLGNBQWUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNwQyxZQUFZLFNBQXdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ3RFLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTVCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDdkQsR0FBRyxFQUFFLEdBQUc7WUFDUixXQUFXLEVBQUUsMEJBQTBCO1NBQ3hDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7WUFDbkMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLO1lBQ3hDLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztZQUMxRCxhQUFhLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQ2hDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUNwQixHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FDdkI7WUFDRCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsdUJBQXVCLEVBQUUsS0FBSztZQUM5QixnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUc7WUFDaEMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyxrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLEdBQUc7WUFDSCxjQUFjLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDN0IsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNuRCxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVsRCxNQUFNLGdCQUFnQixHQUFHLElBQUksWUFBWSxDQUFDLHFDQUFxQyxDQUM3RSxJQUFJLEVBQ0osbUJBQW1CLEVBQ25CO1lBQ0UsT0FBTyxFQUFFLE9BQU87WUFDaEIsR0FBRyxFQUFFLEdBQUc7WUFDUixZQUFZLEVBQUUsQ0FBQztZQUNmLGdCQUFnQixFQUFFO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixXQUFXLEVBQUU7b0JBQ1gsaUJBQWlCLEVBQUUsT0FBTztvQkFDMUIsaUJBQWlCLEVBQUUsT0FBTztvQkFDMUIscUJBQXFCLEVBQUUsV0FBVztvQkFDbEMsaUJBQWlCLEVBQUUsT0FBTztpQkFDM0I7Z0JBQ0QsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxjQUFjLEVBQUUsR0FBRztZQUNuQixrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQ0YsQ0FBQztRQUVGLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUMxQyxXQUFXLEVBQ1gsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQ3RCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFO0lBQ3RDLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7UUFDbkMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtLQUMvQjtJQUNELFdBQVcsRUFBRSw4QkFBOEI7Q0FDNUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSBcIkBhd3MtY2RrL2F3cy1lYzJcIjtcbmltcG9ydCAqIGFzIHJkcyBmcm9tIFwiQGF3cy1jZGsvYXdzLXJkc1wiO1xuaW1wb3J0ICogYXMgZWNzX3BhdHRlcm5zIGZyb20gXCJAYXdzLWNkay9hd3MtZWNzLXBhdHRlcm5zXCI7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcbnJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKCk7XG5jb25zdCBEQl9QT1JUID0gTnVtYmVyKHByb2Nlc3MuZW52W1wiREJfUE9SVFwiXSkgYXMgbnVtYmVyO1xuY29uc3QgREJfTkFNRSA9IHByb2Nlc3MuZW52W1wiREJfTkFNRVwiXSBhcyBzdHJpbmc7XG5jb25zdCBEQl9VU0VSID0gcHJvY2Vzcy5lbnZbXCJEQl9VU0VSXCJdIGFzIHN0cmluZztcbmNvbnN0IERCX1BBU1NXT1JEID0gcHJvY2Vzcy5lbnZbXCJEQl9QQVNTV09SRFwiXSBhcyBzdHJpbmc7XG5jb25zdCBEQl9IT1NUID0gcHJvY2Vzcy5lbnZbXCJEQl9IT1NUXCJdIGFzIHN0cmluZztcbmNsYXNzIFdvcmRwcmVzc1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IoY29uc3RydWN0OiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoY29uc3RydWN0LCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KFwid29yZHByZXNzXCIpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgXCJ2cGNcIiwge1xuICAgICAgbWF4QXpzOiAyLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgd29yZHByZXNzU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgXCJ3cC1zZ1wiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIldvcmRwcmVzcyBzZWN1cml0eSBncm91cFwiLFxuICAgIH0pO1xuXG4gICAgbmV3IHJkcy5EYXRhYmFzZUluc3RhbmNlKHRoaXMsIFwiZGJcIiwge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5NWVNRTCxcbiAgICAgIG1hc3RlclVzZXJuYW1lOiBEQl9VU0VSLFxuICAgICAgbWFzdGVyVXNlclBhc3N3b3JkOiBjZGsuU2VjcmV0VmFsdWUucGxhaW5UZXh0KERCX1BBU1NXT1JEKSxcbiAgICAgIGluc3RhbmNlQ2xhc3M6IGVjMi5JbnN0YW5jZVR5cGUub2YoXG4gICAgICAgIGVjMi5JbnN0YW5jZUNsYXNzLlQyLFxuICAgICAgICBlYzIuSW5zdGFuY2VTaXplLlNNQUxMXG4gICAgICApLFxuICAgICAgc3RvcmFnZUVuY3J5cHRlZDogZmFsc2UsXG4gICAgICBtdWx0aUF6OiBmYWxzZSxcbiAgICAgIGF1dG9NaW5vclZlcnNpb25VcGdyYWRlOiBmYWxzZSxcbiAgICAgIGFsbG9jYXRlZFN0b3JhZ2U6IDI1LFxuICAgICAgc3RvcmFnZVR5cGU6IHJkcy5TdG9yYWdlVHlwZS5HUDIsXG4gICAgICBiYWNrdXBSZXRlbnRpb246IGNkay5EdXJhdGlvbi5kYXlzKDMpLFxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICAgIGRhdGFiYXNlTmFtZTogREJfTkFNRSxcbiAgICAgIHZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbd29yZHByZXNzU2ddLFxuICAgICAgcG9ydDogMzMwNixcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgXCJlY3MtY2x1c3RlclwiLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAod29yZHByZXNzU2cpO1xuXG4gICAgY29uc3Qgd29yZHByZXNzU2VydmljZSA9IG5ldyBlY3NfcGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShcbiAgICAgIHRoaXMsXG4gICAgICBcIndvcmRwcmVzcy1zZXJ2aWNlXCIsXG4gICAgICB7XG4gICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsIC8vIFJlcXVpcmVkXG4gICAgICAgIGNwdTogMjU2LCAvLyBEZWZhdWx0IGlzIDI1NlxuICAgICAgICBkZXNpcmVkQ291bnQ6IDEsIC8vIERlZmF1bHQgaXMgMSxcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBpbWFnZSxcbiAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgV09SRFBSRVNTX0RCX0hPU1Q6IERCX0hPU1QsIC8vIGRiLmRiSW5zdGFuY2VFbmRwb2ludEFkZHJlc3MsXG4gICAgICAgICAgICBXT1JEUFJFU1NfREJfVVNFUjogREJfVVNFUixcbiAgICAgICAgICAgIFdPUkRQUkVTU19EQl9QQVNTV09SRDogREJfUEFTU1dPUkQsXG4gICAgICAgICAgICBXT1JEUFJFU1NfREJfTkFNRTogREJfTkFNRSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuYWJsZUxvZ2dpbmc6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsIC8vIERlZmF1bHQgaXMgNTEyXG4gICAgICAgIHB1YmxpY0xvYWRCYWxhbmNlcjogdHJ1ZSwgLy8gRGVmYXVsdCBpcyBmYWxzZSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgd29yZHByZXNzU2VydmljZS5zZXJ2aWNlLmNvbm5lY3Rpb25zLmFsbG93VG8oXG4gICAgICB3b3JkcHJlc3NTZyxcbiAgICAgIGVjMi5Qb3J0LnRjcChEQl9QT1JUKVxuICAgICk7XG4gIH1cbn1cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgV29yZHByZXNzU3RhY2soYXBwLCBcIkZvcm1zU3RhY2tXUFwiLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkFXU19BQ0NPVU5UX0lELFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTixcbiAgfSxcbiAgZGVzY3JpcHRpb246IFwiRmFyZ2F0ZSBXb3JkUHJlc3MgZGVwbG95bWVudFwiLFxufSk7XG4iXX0=