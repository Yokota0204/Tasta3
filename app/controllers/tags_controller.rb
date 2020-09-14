class TagsController < ApplicationController
  protect_from_forgery

  def index
    @tags = Tag.all
    @tasks = Task.all
  end

  def create
    Tag.create(title: params[:title], status: 0)
    redirect_to '/tags'
  end

  def destroy
    @tag = Tag.find(params[:id])
    @tag.destroy
    redirect_to '/tags'
  end

  def create_task
  end

  def vue_test
  end

end
