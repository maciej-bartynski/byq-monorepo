ssh-into:
	ssh -i byqstaging.pem ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com

copy-envs:
	scp -i ./byqstaging.pem -r ./env.template ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-monorepo

deploy-build:
	scp -i ./byqstaging.pem -r ./frontend/react-app/build ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-monorepo/frontend/react-app

create-env:
	cp .env.template .env