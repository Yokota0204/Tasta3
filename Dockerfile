FROM ruby:2.5
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /myapp
WORKDIR /myapp

COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

RUN git clone https://github.com/Yokota0204/Tasta3.git
RUN bundle install
COPY . /myapp

# docker-compose run --no-deps web rails new . --force --database=postgresql --webpack=vue