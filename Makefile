ssh-into:
	ssh -i byqstaging.pem ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com

deploy-frontend-envs:
	scp -i ./byqstaging.pem -r ./frontend/.env.template ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-monorepo/frontend

deploy-frontend-reactapp-build:
	scp -i ./byqstaging.pem -r ./frontend/react-app/build ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-monorepo/frontend/react-app

danger-deploy-frontend-certs:
	scp -i ./byqstaging.pem -r ./frontend/cert ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-monorepo/frontend