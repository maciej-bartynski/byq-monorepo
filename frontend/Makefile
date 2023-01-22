ssh-into:
	ssh -i byqstaging.pem ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com

copy-envs:
	scp -i ./byqstaging.pem -r ./envs ubuntu@ec2-3-72-231-170.eu-central-1.compute.amazonaws.com:byq-backend

create-env:
	cp .env.template .env

# run:
# 	tmux && npm run start

# deployment:
# 	make ssh-into && cd byq/byq-monorepo && git pull && make copy-env-staging && make run
	