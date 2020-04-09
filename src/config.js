const dev = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-2-api-dev-attachmentsbucket-kxecots2z2y1"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://06hez3skqd.execute-api.us-east-1.amazonaws.com/dev"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_PB71FYLBe",
      APP_CLIENT_ID: "1hhoqsc91dcfpb07uda9f9d18r",
      IDENTITY_POOL_ID: "us-east-1:822f59e3-0485-43cd-84e8-302ae0808edd"
    }
  };

  const prod = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-2-api-prod-attachmentsbucket-1tv6nwgho1zq2"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://wqprxwyrth.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_YNidR47jA",
      APP_CLIENT_ID: "4fk3k58f21kf2k28lm7gqsn3fr",
      IDENTITY_POOL_ID: "us-east-1:8f0cc7f7-57f2-4da2-bdfb-962dee63d975"
    }
  };

  // Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
? prod
: dev;

export default {
// Add common config values here
MAX_ATTACHMENT_SIZE: 5000000,
...config
};